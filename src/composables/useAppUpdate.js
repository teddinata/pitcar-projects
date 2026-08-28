// src/composables/useAppUpdate.js
//
// Deteksi versi baru aplikasi + pengingat update ala WhatsApp.
//
// Ada dua sumber sinyal yang dipakai bersamaan:
//   1. Service worker (vite-plugin-pwa mode 'prompt') -> event "waiting"/needRefresh
//   2. Polling /version.json  -> tetap jalan walau service worker gagal / tidak didukung
//
// Bila salah satu mendeteksi versi lebih baru, popup pembaruan ditampilkan.
// User bisa menunda ("Nanti"); pengingat akan muncul lagi setelah SNOOZE_DURATION.
// Setelah MAX_SNOOZE kali ditunda (atau rilis ditandai `mandatory`), popup
// tidak bisa ditutup lagi sampai user melakukan pembaruan.

import { computed, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { compareVersions } from '@/constants/changelog'

const STORAGE_KEYS = {
  snoozeUntil: 'pitcar:update:snooze-until',
  snoozeCount: 'pitcar:update:snooze-count',
  snoozeVersion: 'pitcar:update:snooze-version',
  applied: 'pitcar:update:applied-version'
}

// Jeda pengingat setelah user menekan "Nanti"
const SNOOZE_DURATION = 4 * 60 * 60 * 1000 // 4 jam
// Berapa kali user boleh menunda sebelum pembaruan menjadi wajib
const MAX_SNOOZE = 3
// Interval pengecekan versi baru di latar belakang
const CHECK_INTERVAL = 15 * 60 * 1000 // 15 menit
// Jarak minimum antar pengecekan (mencegah spam saat tab sering di-focus)
const CHECK_THROTTLE = 60 * 1000 // 1 menit
// Batas tunggu reload setelah service worker diminta mengambil alih
const RELOAD_FALLBACK_DELAY = 3000
// Batas tunggu service worker baru selesai ter-install saat user menekan "Perbarui"
const WAITING_WORKER_TIMEOUT = 5000

const currentVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'
const currentBuildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null

// ---------------------------------------------------------------------------
// State (module-level agar menjadi singleton lintas komponen)
// ---------------------------------------------------------------------------
const updateAvailable = ref(false)
const isVisible = ref(false)
const isUpdating = ref(false)
const snoozeCount = ref(0)
const latestRelease = ref(null)
const justUpdatedFrom = ref(null)

let initialized = false
let swUpdateServiceWorker = null
let swNeedRefresh = null
let swRegistration = null
let checkTimer = null
let snoozeTimer = null
let lastCheckAt = 0

// ---------------------------------------------------------------------------
// Helper localStorage (aman dipakai di private mode / storage diblokir)
// ---------------------------------------------------------------------------
const readStorage = (key) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, String(value))
  } catch {
    /* storage tidak tersedia - fitur tetap jalan, hanya tidak persisten */
  }
}

const removeStorage = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* diabaikan */
  }
}

// ---------------------------------------------------------------------------
// Snooze
// ---------------------------------------------------------------------------
const getSnoozeUntil = () => {
  const raw = Number(readStorage(STORAGE_KEYS.snoozeUntil))
  return Number.isFinite(raw) ? raw : 0
}

// Hitungan snooze hanya berlaku untuk versi yang sama; rilis baru mulai dari nol
const loadSnoozeState = (version) => {
  const storedVersion = readStorage(STORAGE_KEYS.snoozeVersion)
  if (storedVersion && version && storedVersion !== version) {
    clearSnooze()
    return
  }
  snoozeCount.value = Number(readStorage(STORAGE_KEYS.snoozeCount)) || 0
}

const clearSnooze = () => {
  removeStorage(STORAGE_KEYS.snoozeUntil)
  removeStorage(STORAGE_KEYS.snoozeCount)
  removeStorage(STORAGE_KEYS.snoozeVersion)
  snoozeCount.value = 0
  if (snoozeTimer) {
    clearTimeout(snoozeTimer)
    snoozeTimer = null
  }
}

// ---------------------------------------------------------------------------
// Menampilkan popup
// ---------------------------------------------------------------------------
const scheduleReminder = (delay) => {
  if (snoozeTimer) clearTimeout(snoozeTimer)
  snoozeTimer = setTimeout(() => {
    snoozeTimer = null
    if (updateAvailable.value) isVisible.value = true
  }, Math.max(delay, 0))
}

const markUpdateAvailable = (release = null) => {
  if (release) {
    // Pertahankan catatan rilis terlengkap (version.json membawa highlights)
    const known = latestRelease.value
    if (!known || compareVersions(release.version, known.version) >= 0) {
      latestRelease.value = release
    }
  }

  updateAvailable.value = true
  loadSnoozeState(latestRelease.value?.version)

  const snoozeUntil = getSnoozeUntil()
  const remaining = snoozeUntil - Date.now()

  if (remaining > 0 && !isMandatory.value) {
    scheduleReminder(remaining)
    return
  }

  isVisible.value = true
}

// ---------------------------------------------------------------------------
// Pengecekan versi lewat /version.json
// ---------------------------------------------------------------------------
const checkRemoteVersion = async ({ force = false } = {}) => {
  if (typeof window === 'undefined') return
  if (!force && Date.now() - lastCheckAt < CHECK_THROTTLE) return
  if (navigator.onLine === false) return

  lastCheckAt = Date.now()

  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Cache-Control': 'no-cache', Accept: 'application/json' }
    })
    if (!response.ok) return

    const data = await response.json()
    if (!data?.version) return

    if (compareVersions(data.version, currentVersion) > 0) {
      markUpdateAvailable(data)
    }
  } catch {
    // Offline / file belum ada / respons bukan JSON -> abaikan, coba lagi nanti
  }
}

// Minta service worker mengecek apakah ada SW baru di server
const checkServiceWorkerUpdate = async () => {
  if (!swRegistration) return
  try {
    await swRegistration.update()
  } catch {
    /* diabaikan */
  }
}

const runAllChecks = (options) => {
  checkRemoteVersion(options)
  checkServiceWorkerUpdate()
}

// ---------------------------------------------------------------------------
// Menerapkan pembaruan
// ---------------------------------------------------------------------------
const hardReload = async ({ clearCaches = false } = {}) => {
  if (clearCaches && 'caches' in window) {
    try {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
    } catch {
      /* diabaikan */
    }
  }
  window.location.reload()
}

// Ada service worker versi baru yang sudah ter-download dan siap mengambil alih?
const hasWaitingWorker = () => Boolean(swNeedRefresh?.value || swRegistration?.waiting)

// Beri kesempatan service worker baru selesai ter-install sebelum reload,
// supaya reload tidak sekadar menyajikan ulang aset lama dari precache
const waitForWaitingWorker = async (timeout = WAITING_WORKER_TIMEOUT) => {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (hasWaitingWorker()) return true
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  return hasWaitingWorker()
}

const applyUpdate = async () => {
  if (isUpdating.value) return
  isUpdating.value = true

  clearSnooze()
  writeStorage(STORAGE_KEYS.applied, currentVersion)

  try {
    // Versi baru bisa terdeteksi dari /version.json lebih dulu daripada service worker.
    // Pancing pengecekan SW supaya bundle baru sempat ter-download.
    if (!hasWaitingWorker() && swRegistration) {
      await checkServiceWorkerUpdate()
      await waitForWaitingWorker()
    }

    if (swUpdateServiceWorker && hasWaitingWorker()) {
      // Service worker baru akan mengambil alih lalu memicu reload otomatis.
      // Fallback reload manual bila event "controlling" tidak pernah datang.
      setTimeout(() => hardReload(), RELOAD_FALLBACK_DELAY)
      await swUpdateServiceWorker(true)
    } else {
      // Tidak ada SW yang menunggu -> bersihkan cache agar reload benar-benar
      // mengambil aset terbaru dari server
      await hardReload({ clearCaches: true })
    }
  } catch {
    await hardReload({ clearCaches: true })
  }
}

const remindLater = () => {
  if (isMandatory.value) return

  const nextCount = snoozeCount.value + 1
  snoozeCount.value = nextCount

  writeStorage(STORAGE_KEYS.snoozeCount, nextCount)
  writeStorage(STORAGE_KEYS.snoozeUntil, Date.now() + SNOOZE_DURATION)
  if (latestRelease.value?.version) {
    writeStorage(STORAGE_KEYS.snoozeVersion, latestRelease.value.version)
  }

  isVisible.value = false
  scheduleReminder(SNOOZE_DURATION)
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
// Update jadi wajib bila rilis ditandai mandatory atau sudah terlalu sering ditunda
const isMandatory = computed(
  () => latestRelease.value?.mandatory === true || snoozeCount.value >= MAX_SNOOZE
)

const remainingSnooze = computed(() => Math.max(MAX_SNOOZE - snoozeCount.value, 0))

const highlights = computed(() => {
  const items = latestRelease.value?.highlights
  return Array.isArray(items) ? items : []
})

const newVersion = computed(() => latestRelease.value?.version || null)

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
const registerServiceWorker = () => {
  try {
    const { updateServiceWorker, needRefresh } = useRegisterSW({
      immediate: true,
      onNeedRefresh() {
        // Bundle baru sudah ter-download & menunggu; versi persisnya
        // dilengkapi oleh checkRemoteVersion()
        markUpdateAvailable()
        checkRemoteVersion({ force: true })
      },
      onRegisteredSW(_url, registration) {
        swRegistration = registration || null
        checkServiceWorkerUpdate()
      },
      onRegisterError(error) {
        console.error('[update] Gagal registrasi service worker:', error)
      }
    })
    swUpdateServiceWorker = updateServiceWorker
    swNeedRefresh = needRefresh
  } catch (error) {
    // Browser tanpa service worker tetap dilayani oleh polling /version.json
    console.warn('[update] Service worker tidak tersedia:', error)
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') runAllChecks()
}

const init = () => {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  // Tampilkan konfirmasi bila halaman ini adalah hasil pembaruan barusan
  const appliedFrom = readStorage(STORAGE_KEYS.applied)
  if (appliedFrom) {
    removeStorage(STORAGE_KEYS.applied)
    if (compareVersions(currentVersion, appliedFrom) > 0) {
      justUpdatedFrom.value = appliedFrom
    }
  }

  registerServiceWorker()
  checkRemoteVersion({ force: true })

  checkTimer = setInterval(() => runAllChecks({ force: true }), CHECK_INTERVAL)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('online', () => runAllChecks({ force: true }))
}

const dispose = () => {
  if (checkTimer) clearInterval(checkTimer)
  if (snoozeTimer) clearTimeout(snoozeTimer)
  checkTimer = null
  snoozeTimer = null
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  initialized = false
}

export function useAppUpdate() {
  return {
    // state
    updateAvailable,
    isVisible,
    isUpdating,
    isMandatory,
    snoozeCount,
    remainingSnooze,
    latestRelease,
    newVersion,
    highlights,
    justUpdatedFrom,
    currentVersion,
    currentBuildTime,
    // actions
    init,
    dispose,
    applyUpdate,
    remindLater,
    checkNow: () => runAllChecks({ force: true }),
    dismissJustUpdated: () => {
      justUpdatedFrom.value = null
    }
  }
}

export default useAppUpdate
