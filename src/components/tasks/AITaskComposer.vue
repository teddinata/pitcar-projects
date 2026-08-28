<!-- src/components/tasks/AITaskComposer.vue

  Panel "buat tugas dari prompt". Backend: /web/v2/team/tasks/ai/*

  Tiga langkah, dan langkah tengahnya yang paling penting:

    prompt  ->  review  ->  done

  AI hanya mengusulkan; tidak ada satu pun record yang lahir sebelum pengguna
  menekan Simpan di langkah review. Alasannya bukan kehati-hatian umum: model
  membuat `team.project.task` mengirim notifikasi ke setiap penerima tugas
  begitu record dibuat, dan notifikasi ke orang yang salah tidak bisa ditarik
  kembali. Jadi manusia yang memutuskan, per tugas.

  Peringatan dari backend (nama yang tidak dikenali, tanggal di luar periode
  proyek, nama yang sudah dipakai tugas lain) ditampilkan apa adanya di kartu
  masing-masing, tidak diringkas jadi satu angka — yang perlu diperbaiki
  pengguna adalah tugas tertentu, bukan "draft ini" secara keseluruhan.

  Panduan dan contoh prompt di langkah 1 mengikuti pekerjaan tim System
  Development bengkel: menyusun SOP, membakukan form kerja antar cabang,
  menyiapkan materi training, mengaudit kepatuhan di stall, dan perbaikan
  kaizen — bukan pekerjaan pemrograman. Satu-satunya yang dikirim ke model
  adalah teks prompt pengguna, jadi panduan di layar inilah yang menentukan
  kualitas tugas yang dihasilkan.
-->
<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <div class="flex items-start justify-center min-h-screen p-4">
        <div
          class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-5xl mx-auto relative z-10 my-4"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-white flex items-center">
                  <Sparkles class="w-5 h-5 mr-2" />
                  Buat Tugas dengan AI
                </h2>
                <p class="mt-1 text-sm text-red-100">
                  {{ headerSubtitle }}
                </p>
              </div>
              <button @click="close" class="text-white hover:text-gray-200 focus:outline-none">
                <X class="h-5 w-5" />
              </button>
            </div>

            <!-- Penanda langkah -->
            <div class="flex items-center gap-2 mt-3">
              <span
                v-for="(label, key) in STEP_LABELS"
                :key="key"
                class="text-xs px-2 py-0.5 rounded-full"
                :class="
                  step === key
                    ? 'bg-white text-rose-600 font-medium'
                    : 'bg-rose-400/40 text-red-50'
                "
              >
                {{ label }}
              </span>
            </div>
          </div>

          <div class="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto">
            <!-- Fitur belum dinyalakan -->
            <div
              v-if="optionsLoaded && !aiEnabled"
              class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              <p class="font-medium flex items-center">
                <AlertTriangle class="w-4 h-4 mr-1.5" />
                Fitur AI belum aktif
              </p>
              <p class="mt-1">
                Kunci API Gemini belum diisi. Minta admin mengisi parameter sistem
                <code class="bg-amber-100 px-1 rounded">pitcar.gemini.api_key</code>
                di Settings &gt; Technical &gt; System Parameters.
              </p>
            </div>

            <!-- Kesalahan -->
            <div
              v-if="errorMsg"
              class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p class="font-medium flex items-center">
                <AlertTriangle class="w-4 h-4 mr-1.5" />
                Gagal
              </p>
              <p class="mt-1">{{ errorMsg }}</p>
            </div>

            <!-- ============ LANGKAH 1: PROMPT ============ -->
            <div v-if="step === 'prompt' && aiEnabled" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Proyek *</label>
                <select
                  v-model="projectId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option :value="null">Pilih proyek</option>
                  <option v-for="p in projects" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Proyek menentukan siapa yang bisa ditugaskan dan rentang tanggal yang
                  dianggap wajar. Tanpa itu AI cuma menebak.
                </p>
              </div>

              <!-- Roster: ditampilkan supaya pengguna tahu batas pilihan AI sebelum
                   menulis prompt, bukan kaget saat namanya ternyata diabaikan. -->
              <div v-if="projectId" class="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <p class="text-xs font-medium text-gray-600 mb-2">
                  Orang yang bisa ditugaskan di proyek ini
                  <span v-if="optionsLoading" class="text-gray-400">(memuat…)</span>
                </p>
                <div v-if="roster.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="p in roster"
                    :key="p.id"
                    class="text-xs px-2 py-1 rounded-full bg-white border border-gray-300 text-gray-700"
                  >
                    {{ p.name }}
                    <span v-if="p.is_manager" class="text-rose-500">· PM</span>
                  </span>
                </div>
                <p v-else-if="!optionsLoading" class="text-xs text-amber-700">
                  Proyek ini belum punya anggota tim. AI tidak akan menugaskan siapa pun —
                  Anda harus memilih sendiri di langkah berikutnya.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Apa yang perlu dikerjakan? *
                </label>
                <textarea
                  v-model="prompt"
                  rows="5"
                  :maxlength="maxPromptChars"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Contoh: susun SOP serah terima kendaraan untuk cabang Sidoarjo — draft alur, buat form checklist final inspection, uji coba di satu stall, lalu sosialisasi ke service advisor. Budi pegang draft SOP, target selesai akhir bulan."
                ></textarea>
                <div class="flex items-center justify-between mt-1">
                  <p class="text-xs text-gray-500">
                    Tulis pekerjaannya seperti menjelaskan ke rekan tim. Yang tidak
                    disebutkan akan diasumsikan, dan asumsinya ditulis di hasil.
                  </p>
                  <span class="text-xs text-gray-400 shrink-0 ml-2">
                    {{ prompt.length }}/{{ maxPromptChars }}
                  </span>
                </div>
              </div>

              <!-- Panduan: dipasang di layar prompt, bukan di dokumentasi terpisah,
                   karena kualitas tugas yang dihasilkan hampir seluruhnya ditentukan
                   di sini. Butirnya sengaja spesifik ke pekerjaan tim System
                   Development bengkel — proses, keluaran, dan siapa yang
                   menjalankan di lapangan. -->
              <div class="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p class="text-xs font-medium text-blue-900 flex items-center mb-1.5">
                  <Lightbulb class="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  Supaya tugasnya terpecah dengan tepat, sebutkan sebisanya:
                </p>
                <ul class="space-y-1">
                  <li
                    v-for="(g, i) in PROMPT_GUIDE"
                    :key="i"
                    class="flex items-start text-xs text-blue-900/90 leading-snug"
                  >
                    <span class="mt-1.5 mr-1.5 h-1 w-1 rounded-full bg-blue-400 shrink-0"></span>
                    <span>
                      <span class="font-medium">{{ g.label }}</span> — {{ g.hint }}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p class="text-xs text-gray-500 mb-1.5">Mulai dari contoh:</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="ex in EXAMPLES"
                    :key="ex.label"
                    type="button"
                    :title="ex.prompt"
                    @click="prompt = ex.prompt"
                    class="text-xs px-2.5 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-700 transition-colors"
                  >
                    {{ ex.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Maksimal jumlah tugas
                </label>
                <select
                  v-model.number="maxTasks"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option v-for="n in [3, 5, 8, 12, 20]" :key="n" :value="n">{{ n }} tugas</option>
                </select>
              </div>
            </div>

            <!-- ============ LANGKAH 2: TINJAU ============ -->
            <div v-else-if="step === 'review'" class="space-y-4">
              <div
                v-if="draft.ringkasan"
                class="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-900"
              >
                {{ draft.ringkasan }}
              </div>

              <div
                v-if="draft.asumsi?.length"
                class="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-900"
              >
                <p class="font-medium mb-1">Asumsi yang diambil AI</p>
                <ul class="list-disc list-inside space-y-0.5">
                  <li v-for="(a, i) in draft.asumsi" :key="i">{{ a }}</li>
                </ul>
              </div>

              <div
                v-if="draft.perlu_diklarifikasi?.length"
                class="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900"
              >
                <p class="font-medium mb-1">Belum tercakup / perlu diputuskan sendiri</p>
                <ul class="list-disc list-inside space-y-0.5">
                  <li v-for="(q, i) in draft.perlu_diklarifikasi" :key="i">{{ q }}</li>
                </ul>
              </div>

              <!-- Kartu tugas -->
              <div
                v-for="(item, idx) in items"
                :key="idx"
                class="rounded-lg border p-4"
                :class="item.include ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'"
              >
                <div class="flex items-start gap-3">
                  <input
                    type="checkbox"
                    v-model="item.include"
                    class="mt-1.5 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <div class="flex-1 min-w-0 space-y-3">
                    <input
                      v-model="item.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Nama tugas"
                    />

                    <!-- Peringatan dari backend -->
                    <div
                      v-if="item.warnings?.length"
                      class="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800"
                    >
                      <p v-for="(w, wi) in item.warnings" :key="wi" class="flex items-start">
                        <AlertTriangle class="w-3.5 h-3.5 mr-1 mt-px shrink-0" />
                        <span>{{ w }}</span>
                      </p>
                    </div>

                    <textarea
                      v-model="item.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Deskripsi"
                    ></textarea>

                    <!-- Penanggung jawab: chip, bukan dropdown. Di layar tinjauan,
                         siapa mengerjakan apa harus terbaca sekilas. -->
                    <div>
                      <p class="text-xs font-medium text-gray-600 mb-1">
                        Penanggung jawab *
                        <span v-if="!item.assigned_ids.length" class="text-red-600">
                          — wajib dipilih
                        </span>
                      </p>
                      <div v-if="roster.length" class="flex flex-wrap gap-1.5">
                        <button
                          v-for="p in roster"
                          :key="p.id"
                          type="button"
                          @click="toggleAssignee(item, p.id)"
                          class="text-xs px-2.5 py-1 rounded-full border transition-colors"
                          :class="
                            item.assigned_ids.includes(p.id)
                              ? 'bg-rose-600 border-rose-600 text-white'
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                          "
                        >
                          {{ p.name }}
                        </button>
                      </div>
                      <p v-else class="text-xs text-amber-700">
                        Proyek ini belum punya anggota tim, jadi tugas tidak bisa disimpan.
                        Tambahkan anggota di halaman proyek lebih dulu.
                      </p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Prioritas</label>
                        <select
                          v-model="item.priority"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option v-for="p in priorities" :key="p.value" :value="p.value">
                            {{ p.label }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-600 mb-1"
                          title="Perkiraan bobot pekerjaan secara relatif — makin besar angkanya, makin berat tugasnya dibanding tugas lain"
                        >
                          Bobot
                        </label>
                        <select
                          v-model="item.story_points"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option :value="null">—</option>
                          <option v-for="sp in storyPoints" :key="sp" :value="sp">{{ sp }}</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">
                          Estimasi (jam)
                        </label>
                        <input
                          v-model.number="item.planned_hours"
                          type="number"
                          min="0"
                          step="0.5"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Tipe</label>
                        <select
                          v-model="item.type_id"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option :value="null">—</option>
                          <option v-for="t in taskTypes" :key="t.id" :value="t.id">
                            {{ t.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Mulai</label>
                        <input
                          v-model="item.date_start"
                          type="datetime-local"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Selesai</label>
                        <input
                          v-model="item.date_end"
                          type="datetime-local"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Reviewer</label>
                        <select
                          v-model="item.reviewer_id"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option :value="null">—</option>
                          <option v-for="p in roster" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">
                        Checklist — satu langkah per baris
                      </label>
                      <textarea
                        v-model="item.checklist_text"
                        rows="3"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Kosongkan kalau tugas ini tidak punya langkah terpisah"
                      ></textarea>
                    </div>

                    <p v-if="item.alasan" class="text-xs text-gray-500 italic">
                      Alasan AI: {{ item.alasan }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============ LANGKAH 3: HASIL ============ -->
            <div v-else-if="step === 'done'" class="space-y-4">
              <div
                v-if="result.created?.length"
                class="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-900"
              >
                <p class="font-medium flex items-center mb-2">
                  <Check class="w-4 h-4 mr-1.5" />
                  {{ result.created.length }} tugas berhasil dibuat
                </p>
                <ul class="list-disc list-inside space-y-0.5">
                  <li v-for="c in result.created" :key="c.id">
                    {{ c.name }}
                    <span v-if="c.checklist_count" class="text-green-700">
                      ({{ c.checklist_count }} checklist)
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Kegagalan sebagian ditampilkan, tidak ditelan. Sebagian tersimpan
                   dan sebagian tidak adalah keadaan yang harus dibereskan manual. -->
              <div
                v-if="result.failed?.length"
                class="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-900"
              >
                <p class="font-medium mb-2">{{ result.failed.length }} tugas gagal disimpan</p>
                <ul class="list-disc list-inside space-y-0.5">
                  <li v-for="(f, i) in result.failed" :key="i">
                    {{ f.name }} — {{ f.error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              v-if="step === 'review'"
              type="button"
              @click="backToPrompt"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft class="w-4 h-4 mr-1" />
              Ubah prompt
            </button>
            <span v-else></span>

            <div class="flex items-center gap-2">
              <span v-if="step === 'review'" class="text-xs text-gray-500 mr-1">
                {{ includedCount }} dari {{ items.length }} tugas dipilih
              </span>

              <button
                type="button"
                @click="close"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {{ step === 'done' ? 'Tutup' : 'Batal' }}
              </button>

              <button
                v-if="step === 'prompt'"
                type="button"
                :disabled="!canGenerate || drafting"
                @click="generate"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader v-if="drafting" class="w-4 h-4 mr-1.5 animate-spin" />
                <Sparkles v-else class="w-4 h-4 mr-1.5" />
                {{ drafting ? 'Menyusun tugas…' : 'Buat draft' }}
              </button>

              <button
                v-else-if="step === 'review'"
                type="button"
                :disabled="!canSave || saving"
                @click="save"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :title="saveBlockedReason"
              >
                <Loader v-if="saving" class="w-4 h-4 mr-1.5 animate-spin" />
                <Save v-else class="w-4 h-4 mr-1.5" />
                {{ saving ? 'Menyimpan…' : `Simpan ${includedCount} tugas` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Sparkles,
  X,
  AlertTriangle,
  Check,
  ChevronLeft,
  Lightbulb,
  Loader,
  Save,
} from 'lucide-vue-next'
import { taskAIService } from '@/services/taskAI.service'

const props = defineProps({
  show: { type: Boolean, default: false },
  // Daftar proyek dari halaman induk — tidak diambil ulang di sini supaya
  // filter proyek yang sedang aktif dan pilihan di panel ini tetap sinkron.
  projects: { type: Array, default: () => [] },
  defaultProjectId: { type: [Number, String], default: null },
})

const emit = defineEmits(['close', 'created', 'notify'])

const STEP_LABELS = { prompt: '1. Prompt', review: '2. Tinjau', done: '3. Selesai' }

// Panduan menulis prompt untuk pekerjaan tim System Development bengkel:
// membakukan cara kerja operasional, bukan membangun perangkat lunak.
// Urutannya mengikuti yang paling sering hilang dari prompt: orang biasanya
// menulis keluaran yang diinginkan tapi lupa proses mana yang disasar dan
// siapa yang nanti menjalankan di lapangan.
const PROMPT_GUIDE = [
  {
    label: 'Proses yang disasar',
    hint: 'penerimaan unit, PKB, final inspection, alur sparepart, booking servis, atau serah terima',
  },
  {
    label: 'Keluaran yang diharapkan',
    hint: 'SOP, form/checklist, materi training, lembar audit, atau laporan perbaikan',
  },
  {
    label: 'Cabang & pelaksana',
    hint: 'cabang atau stall yang terdampak, dan siapa yang menjalankan — mekanik, service advisor, atau admin part',
  },
  {
    label: 'Uji coba & sosialisasi',
    hint: 'sebutkan kalau perubahannya menyentuh orang di lapangan, supaya tahapannya ikut dibuatkan tugas',
  },
  {
    label: 'Penanggung jawab & tenggat',
    hint: 'nama orang dan target tanggal kalau sudah ditentukan',
  },
]

// Contoh prompt sengaja memakai pekerjaan nyata tim System Development bengkel:
// menyusun SOP, membakukan form kerja, menyiapkan materi training, dan
// mengaudit kepatuhan di stall — bukan pekerjaan pemrograman. Prompt yang
// bagus menyebut proses yang disasar, keluarannya, dan siapa yang menjalankan
// di lapangan, karena tiga hal itu yang menentukan tugasnya pecah jadi apa.
const EXAMPLES = [
  {
    label: 'SOP proses baru',
    prompt:
      'Susun SOP serah terima kendaraan untuk cabang baru — petakan alur yang berjalan sekarang, buat draft SOP, siapkan form checklist serah terima, uji coba di satu stall selama seminggu, lalu sosialisasi ke service advisor dan mekanik.',
  },
  {
    label: 'Bakukan form antar cabang',
    prompt:
      'Bakukan form PKB yang dipakai antar cabang — kumpulkan versi yang berjalan di tiap cabang, bandingkan isinya, satukan jadi satu format, minta persetujuan kepala bengkel, lalu uji coba dua minggu sebelum dipakai penuh.',
  },
  {
    label: 'Materi training',
    prompt:
      'Siapkan materi training service advisor untuk alur booking servis yang baru — susun modul, buat skenario simulasi, siapkan lembar evaluasi, dan jadwalkan sesi untuk tiap cabang.',
  },
  {
    label: 'Audit kepatuhan SOP',
    prompt:
      'Audit kepatuhan SOP final inspection bulan ini di semua stall — siapkan lembar audit, jalankan pengecekan per stall, rangkum temuan, lalu susun usulan perbaikan beserta penanggung jawabnya.',
  },
  {
    label: 'Perbaikan kaizen',
    prompt:
      'Kurangi waktu tunggu pelanggan di area service — ukur waktu tunggu selama seminggu, cari titik penumpukan, usulkan perbaikan alur, dan uji coba perubahannya di satu cabang.',
  },
]

const step = ref('prompt')
const projectId = ref(null)
const prompt = ref('')
const maxTasks = ref(8)

const options = ref(null)
const optionsLoading = ref(false)
const optionsLoaded = ref(false)

const draft = ref({})
const items = ref([])
const result = ref({})

const drafting = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const aiEnabled = computed(() => options.value?.ai_enabled !== false)
const roster = computed(() => options.value?.roster || [])
const taskTypes = computed(() => draft.value?.task_types || options.value?.task_types || [])
const priorities = computed(
  () =>
    options.value?.priorities || [
      { value: '0', label: 'Low' },
      { value: '1', label: 'Medium' },
      { value: '2', label: 'High' },
      { value: '3', label: 'Critical' },
    ]
)
const storyPoints = computed(() => options.value?.story_points || ['1', '2', '3', '5', '8', '13', '21'])
const maxPromptChars = computed(() => options.value?.max_prompt_chars || 4000)

const headerSubtitle = computed(() => {
  if (step.value === 'prompt') return 'Jelaskan pekerjaannya, AI yang menyusun tugasnya'
  if (step.value === 'review') return 'Periksa dan perbaiki sebelum disimpan — belum ada yang tersimpan'
  return 'Hasil penyimpanan'
})

const includedCount = computed(() => items.value.filter((i) => i.include).length)

const canGenerate = computed(() => !!projectId.value && prompt.value.trim().length >= 5)

// Tugas tanpa penanggung jawab ditolak backend (field wajib di model), jadi
// tombol simpan dimatikan lebih dulu — lebih baik daripada mengirim lalu
// menampilkan pesan error yang tidak jelas menunjuk tugas yang mana.
const blockingItems = computed(() =>
  items.value.filter((i) => i.include && !i.assigned_ids.length)
)
const canSave = computed(() => includedCount.value > 0 && blockingItems.value.length === 0)
const saveBlockedReason = computed(() => {
  if (!includedCount.value) return 'Pilih minimal satu tugas'
  if (blockingItems.value.length) {
    return `Belum ada penanggung jawab: ${blockingItems.value.map((i) => i.name).join(', ')}`
  }
  return ''
})

// 'YYYY-MM-DD HH:MM:SS' (backend) <-> 'YYYY-MM-DDTHH:MM' (input datetime-local)
const toInput = (v) => (v ? String(v).replace(' ', 'T').slice(0, 16) : '')
const fromInput = (v) => (v ? String(v).replace('T', ' ') : null)

const loadOptions = async () => {
  if (!projectId.value) {
    options.value = null
    optionsLoaded.value = false
    return
  }
  optionsLoading.value = true
  try {
    options.value = await taskAIService.getOptions(parseInt(projectId.value))
    optionsLoaded.value = true
    if (options.value?.max_tasks) maxTasks.value = options.value.max_tasks
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    optionsLoading.value = false
  }
}

const reset = () => {
  step.value = 'prompt'
  prompt.value = ''
  draft.value = {}
  items.value = []
  result.value = {}
  errorMsg.value = ''
  projectId.value = props.defaultProjectId ? parseInt(props.defaultProjectId) : null
}

watch(
  () => props.show,
  (open) => {
    if (open) {
      reset()
      loadOptions()
    }
  }
)

watch(projectId, () => {
  // Roster berbeda per proyek; draft yang sudah ada jadi tidak sahih lagi.
  if (step.value === 'review') step.value = 'prompt'
  loadOptions()
})

const generate = async () => {
  errorMsg.value = ''
  drafting.value = true
  try {
    const data = await taskAIService.draft({
      prompt: prompt.value.trim(),
      projectId: parseInt(projectId.value),
      maxTasks: maxTasks.value,
    })
    draft.value = data
    items.value = (data.tasks || []).map((t) => ({
      include: true,
      name: t.name,
      description: t.description || '',
      priority: t.priority || '1',
      story_points: t.story_points || null,
      planned_hours: t.planned_hours || 0,
      date_start: toInput(t.planned_date_start),
      date_end: toInput(t.planned_date_end),
      assigned_ids: (t.assigned_to || []).map((a) => a.id),
      reviewer_id: t.reviewer?.id || null,
      type_id: t.type?.id || null,
      checklist_text: (t.checklist || []).join('\n'),
      warnings: t.warnings || [],
      alasan: t.alasan || '',
    }))
    // Roster dari respons draft menang: itu yang benar-benar dipakai AI.
    if (data.roster) options.value = { ...(options.value || {}), roster: data.roster }
    step.value = 'review'
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    drafting.value = false
  }
}

const toggleAssignee = (item, id) => {
  const at = item.assigned_ids.indexOf(id)
  if (at === -1) item.assigned_ids.push(id)
  else item.assigned_ids.splice(at, 1)
}

const save = async () => {
  errorMsg.value = ''
  saving.value = true
  try {
    const payload = items.value
      .filter((i) => i.include)
      .map((i) => ({
        name: i.name,
        description: i.description,
        priority: i.priority,
        story_points: i.story_points || null,
        planned_hours: i.planned_hours || 0,
        planned_date_start: fromInput(i.date_start),
        planned_date_end: fromInput(i.date_end),
        assigned_to: i.assigned_ids,
        reviewer_id: i.reviewer_id || null,
        type_id: i.type_id || null,
        checklist: i.checklist_text
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      }))

    result.value = await taskAIService.create({
      projectId: parseInt(projectId.value),
      tasks: payload,
      prompt: prompt.value.trim(),
    })
    step.value = 'done'
    emit('created', result.value)
    emit('notify', {
      message: `${result.value.created?.length || 0} tugas dibuat dari prompt AI`,
      type: result.value.partial ? 'warning' : 'success',
    })
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    saving.value = false
  }
}

const backToPrompt = () => {
  step.value = 'prompt'
  errorMsg.value = ''
}

const close = () => emit('close')
</script>
