<!-- src/components/AppUpdatePrompt.vue -->
<!--
  Popup pembaruan aplikasi ala WhatsApp.

  - Muncul otomatis saat terdeteksi versi baru (service worker / /version.json)
  - Bisa ditunda dengan tombol "Nanti", lalu mengingatkan lagi setelah beberapa jam
  - Setelah beberapa kali ditunda (atau rilis wajib), popup tidak bisa ditutup
  - Menampilkan konfirmasi singkat setelah aplikasi berhasil diperbarui
-->
<template>
  <Teleport to="body">
    <!-- ================= Pembaruan WAJIB: modal penuh ================= -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPrompt && isMandatory"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="app-update-title"
      >
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-gradient-to-r from-rose-600 to-red-500 px-6 py-5 text-white">
            <div class="flex items-center gap-3">
              <div class="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center flex-none">
                <ArrowUpCircle class="h-6 w-6" />
              </div>
              <div class="min-w-0">
                <h2 id="app-update-title" class="text-base font-semibold leading-tight">
                  Pembaruan Diperlukan
                </h2>
                <p class="text-xs text-white/80 mt-0.5">
                  {{ versionLabel }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-5">
            <p class="text-sm text-gray-600">
              {{ mandatoryReason }}
            </p>

            <ReleaseHighlights v-if="highlights.length" :items="highlights" class="mt-4" />

            <button
              type="button"
              :disabled="isUpdating"
              @click="applyUpdate"
              class="mt-5 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw v-if="isUpdating" class="h-4 w-4 mr-2 animate-spin" />
              <Download v-else class="h-4 w-4 mr-2" />
              {{ isUpdating ? 'Memperbarui…' : 'Perbarui Sekarang' }}
            </button>

            <p class="mt-3 text-[11px] text-center text-gray-400">
              Aplikasi akan dimuat ulang sebentar. Pastikan pekerjaan Anda sudah tersimpan.
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============== Pembaruan OPSIONAL: kartu mengambang ============== -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-6 sm:translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-6 sm:translate-y-4"
    >
      <div
        v-if="showPrompt && !isMandatory"
        class="fixed z-[9998] inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 max-w-[calc(100vw-1.5rem)]"
        role="dialog"
        aria-labelledby="app-update-card-title"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-rose-600 to-red-500 px-4 py-3 flex items-start gap-3 text-white">
            <div class="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center flex-none">
              <Sparkles class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 id="app-update-card-title" class="text-sm font-semibold leading-tight">
                Pembaruan Tersedia
              </h2>
              <p class="text-[11px] text-white/80 mt-0.5 truncate">
                {{ versionLabel }}
              </p>
            </div>
            <button
              type="button"
              @click="remindLater"
              class="flex-none rounded-full p-1 hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Ingatkan nanti"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-4 py-3.5">
            <p v-if="releaseTitle" class="text-sm font-medium text-gray-900">
              {{ releaseTitle }}
            </p>

            <ReleaseHighlights v-if="highlights.length" :items="highlights" class="mt-2.5" />
            <p v-else class="mt-1 text-xs text-gray-500">
              Versi terbaru aplikasi sudah siap dipasang.
            </p>

            <!-- Peringatan setelah beberapa kali ditunda -->
            <div
              v-if="snoozeCount > 0"
              class="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-2"
            >
              <AlertTriangle class="h-3.5 w-3.5 text-amber-500 flex-none mt-0.5" />
              <p class="text-[11px] text-amber-700 leading-snug">
                Pengingat ke-{{ snoozeCount + 1 }}.
                <template v-if="remainingSnooze > 0">
                  Anda masih bisa menunda {{ remainingSnooze }}× lagi sebelum pembaruan menjadi wajib.
                </template>
                <template v-else>
                  Pembaruan akan menjadi wajib pada pengingat berikutnya.
                </template>
              </p>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex items-center gap-2">
              <button
                type="button"
                :disabled="isUpdating"
                @click="applyUpdate"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw v-if="isUpdating" class="h-4 w-4 mr-1.5 animate-spin" />
                <Download v-else class="h-4 w-4 mr-1.5" />
                {{ isUpdating ? 'Memperbarui…' : 'Perbarui Sekarang' }}
              </button>
              <button
                type="button"
                :disabled="isUpdating"
                @click="remindLater"
                class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-70 transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============== Konfirmasi setelah berhasil update ============== -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="justUpdatedFrom"
        class="fixed z-[9998] inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-80 max-w-[calc(100vw-1.5rem)]"
        role="status"
      >
        <div
          class="bg-white rounded-xl shadow-xl border border-emerald-200 px-4 py-3 flex items-start gap-3"
        >
          <div class="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-none">
            <CheckCircle2 class="h-4 w-4 text-emerald-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">Aplikasi diperbarui</p>
            <p class="text-xs text-gray-500 mt-0.5">
              Sekarang menggunakan versi {{ currentVersion }}.
            </p>
          </div>
          <button
            type="button"
            @click="dismissJustUpdated"
            class="flex-none rounded-full p-1 text-gray-400 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Tutup"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import {
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-vue-next'
import { useAppUpdate } from '@/composables/useAppUpdate'
import ReleaseHighlights from '@/components/ReleaseHighlights.vue'

const {
  isVisible,
  isUpdating,
  isMandatory,
  hasNewerVersion,
  snoozeCount,
  remainingSnooze,
  latestRelease,
  newVersion,
  highlights,
  justUpdatedFrom,
  currentVersion,
  init,
  applyUpdate,
  remindLater,
  dismissJustUpdated
} = useAppUpdate()

// Lapis terakhir: popup hanya boleh tampil kalau memang ada versi lebih baru.
// Composable sudah menjaganya, tapi mode wajib tidak bisa ditutup user — jadi
// kondisi ini sengaja diulang di sini supaya tidak ada jalan tembus.
const showPrompt = computed(() => isVisible.value && hasNewerVersion.value)

const releaseTitle = computed(() => latestRelease.value?.title || '')

const versionLabel = computed(() =>
  newVersion.value
    ? `Versi ${newVersion.value} · saat ini ${currentVersion}`
    : `Versi baru tersedia · saat ini ${currentVersion}`
)

const mandatoryReason = computed(() =>
  latestRelease.value?.mandatory
    ? 'Rilis ini berisi perubahan penting, jadi aplikasi perlu diperbarui sebelum dilanjutkan.'
    : 'Pembaruan sudah beberapa kali ditunda. Silakan perbarui sekarang agar data yang tampil tetap akurat.'
)

onMounted(() => {
  init()
})

// Sembunyikan konfirmasi "berhasil diperbarui" secara otomatis
watch(justUpdatedFrom, (value) => {
  if (value) setTimeout(() => dismissJustUpdated(), 8000)
})
</script>
