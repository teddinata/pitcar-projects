<!-- src/components/tasks/AIQuickTaskBar.vue

  Baris ketik-cepat: satu kalimat, Enter, tugas jadi.
  Backend: /web/v2/team/tasks/ai/quick

  Sengaja TANPA langkah tinjauan, berbeda dari AITaskComposer. Yang membuat
  itu aman bukan keberanian, tapi satu aturan di backend: kalau kalimatnya
  tidak menyebut nama orang, tugas ditugaskan ke pemanggil sendiri. Salah
  menugaskan diri sendiri tidak melukai siapa pun.

  Yang tetap harus terlihat setelah tugas jadi adalah TAFSIRANNYA — terutama
  tanggal, karena "29 Agustus sampai 30 Agustus" salah baca adalah kegagalan
  paling mungkin di alur tanpa tinjauan dan paling murah diperbaiki kalau
  langsung kelihatan. Karena itu hasilnya tidak sekadar toast "berhasil".
-->
<template>
  <div>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Loader v-if="loading" class="h-4 w-4 text-rose-500 animate-spin" />
        <Sparkles v-else class="h-4 w-4 text-rose-500" />
      </div>
      <input
        v-model="text"
        type="text"
        :disabled="loading"
        :placeholder="placeholder"
        class="w-full pl-9 pr-24 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-50"
        @keydown.enter.prevent="submit"
      />
      <button
        type="button"
        :disabled="!canSubmit"
        @click="submit"
        class="absolute inset-y-1 right-1 px-3 text-xs font-medium text-white rounded-md bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Membuat…' : 'Buat' }}
      </button>
    </div>

    <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
      <span class="text-xs text-gray-500">Contoh:</span>
      <button
        v-for="ex in EXAMPLES"
        :key="ex"
        type="button"
        class="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
        @click="text = ex"
      >
        {{ ex }}
      </button>
    </div>

    <!-- Kesalahan -->
    <div
      v-if="error"
      class="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
    >
      <p class="flex items-start">
        <AlertTriangle class="w-3.5 h-3.5 mr-1.5 mt-px shrink-0" />
        <span>{{ error }}</span>
      </p>
      <p v-if="errorCode === 'need_project'" class="mt-1 pl-5 text-red-600">
        Pilih proyek di filter di atas, atau sebut nama proyeknya di kalimat.
      </p>
    </div>

    <!-- Hasil: tafsiran ditampilkan, bukan cuma "berhasil" -->
    <div
      v-if="last"
      class="mt-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="font-medium text-green-900 flex items-center">
            <Check class="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span class="truncate">{{ last.interpretasi.name }}</span>
          </p>
          <dl class="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-green-800">
            <div class="flex gap-1">
              <dt class="text-green-600">Proyek:</dt>
              <dd class="truncate">{{ last.interpretasi.project.name }}</dd>
            </div>
            <div class="flex gap-1">
              <dt class="text-green-600">Ditugaskan:</dt>
              <dd class="truncate">{{ assigneeNames }}</dd>
            </div>
            <div class="flex gap-1">
              <dt class="text-green-600">Mulai:</dt>
              <dd>{{ last.interpretasi.planned_date_start || '—' }}</dd>
            </div>
            <div class="flex gap-1">
              <dt class="text-green-600">Selesai:</dt>
              <dd>{{ last.interpretasi.planned_date_end || '—' }}</dd>
            </div>
          </dl>
          <p v-if="last.interpretasi.catatan_ai" class="mt-1 text-green-700 italic">
            {{ last.interpretasi.catatan_ai }}
          </p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            class="px-2 py-1 rounded border border-green-300 bg-white text-green-800 hover:bg-green-100"
            @click="$emit('open-task', last.task.id)"
          >
            Buka
          </button>
          <button
            type="button"
            class="p-1 rounded text-green-700 hover:bg-green-100"
            title="Tutup"
            @click="last = null"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Peringatan backend: penugasan default, tanggal di luar periode proyek -->
      <ul
        v-if="last.warnings?.length"
        class="mt-2 pt-2 border-t border-green-200 space-y-0.5 text-amber-800"
      >
        <li v-for="(w, i) in last.warnings" :key="i" class="flex items-start">
          <AlertTriangle class="w-3 h-3 mr-1.5 mt-0.5 shrink-0" />
          <span>{{ w }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Loader, Check, X, AlertTriangle } from 'lucide-vue-next'
import { taskAIService } from '@/services/taskAI.service'

const props = defineProps({
  // Proyek dari filter halaman. Boleh kosong — backend akan memilih dari
  // proyek aktif dan menolak kalau tidak yakin, alih-alih menebak.
  projectId: { type: [Number, String], default: null },
})

const emit = defineEmits(['created', 'open-task', 'notify'])

// Contoh memakai kosakata kerja tim: SOP, form antar cabang, audit stall,
// materi training. Yang dipakai orang untuk menebak "kalimat seperti apa yang
// dimengerti" adalah contoh di layar, bukan dokumentasi.
const EXAMPLES = [
  'buatkan tugas sampling SOP v3 deadline 29 Agustus 2026 sampai 30 Agustus 2026',
  'audit kepatuhan SOP final inspection cabang Purwokerto tanggal 2 September',
  'siapkan lembar checklist serah terima kendaraan, selesai akhir minggu ini',
]

const text = ref('')
const loading = ref(false)
const error = ref('')
const errorCode = ref('')
const last = ref(null)

const placeholder = computed(() =>
  props.projectId
    ? 'Ketik satu kalimat, tekan Enter — tugas langsung dibuat'
    : 'Ketik satu kalimat (sebut nama proyeknya), tekan Enter'
)

const canSubmit = computed(() => !loading.value && text.value.trim().length >= 5)

const assigneeNames = computed(
  () => (last.value?.interpretasi.assigned_to || []).map((a) => a.name).join(', ') || '—'
)

const submit = async () => {
  if (!canSubmit.value) return
  loading.value = true
  error.value = ''
  errorCode.value = ''
  try {
    const data = await taskAIService.quick({
      prompt: text.value.trim(),
      projectId: props.projectId ? parseInt(props.projectId) : null,
    })
    last.value = data
    text.value = ''
    emit('created', data)
    emit('notify', {
      message: `Tugas "${data.interpretasi.name}" dibuat`,
      type: data.warnings?.length ? 'warning' : 'success',
    })
  } catch (e) {
    error.value = e.message
    errorCode.value = e.code || ''
  } finally {
    loading.value = false
  }
}
</script>
