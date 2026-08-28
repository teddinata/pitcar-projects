// File: src/services/taskAI.service.js
//
// Wrapper endpoint pembuatan tugas dari prompt
// (backend: pitcar_custom/controllers/project_task_ai_api.py).
//
// Alur tiga langkah, dan urutannya penting:
//   getOptions() -> draft() -> create()
//
// draft() TIDAK menyimpan apa pun. Tugas baru lahir saat create() dipanggil
// dengan isi yang sudah ditinjau manusia — model bahasa salah menebak orang
// dan tanggal dengan cara yang tidak selalu kelihatan sekilas, dan tugas yang
// salah alamat langsung mengirim notifikasi ke orang itu.

import api from '../config/api'

async function call(url, params = {}) {
  const response = await api.post(url, {
    jsonrpc: '2.0',
    method: 'call',
    params,
  })

  // Dua lapis error yang berbeda: 'error' = JSON-RPC gagal (traceback Odoo),
  // 'result.status' = permintaan sampai tapi ditolak controller.
  if (response.data.error) {
    const rpc = response.data.error
    throw new Error(rpc.data?.message || rpc.message || 'Terjadi kesalahan di server')
  }

  const result = response.data.result
  if (!result) throw new Error('Response kosong dari server')

  if (result.status === 'error') {
    const err = new Error(result.message || 'Permintaan ditolak server')
    // Kode dipakai UI untuk membedakan "AI belum dinyalakan" (perlu admin)
    // dari kesalahan isian biasa (perlu pengguna).
    err.code = result.code
    throw err
  }

  return result.data
}

export const taskAIService = {
  // ai_enabled, roster proyek, tipe tugas, batas jumlah tugas & panjang prompt.
  // Kirim projectId supaya roster ikut terisi dalam satu panggilan.
  getOptions: (projectId = null) =>
    call('/web/v2/team/tasks/ai/options', projectId ? { project_id: projectId } : {}),

  // Prompt -> usulan tugas. Tidak menyimpan.
  // Tiap tugas membawa warnings[] dan ready; yang ready=false belum punya
  // penanggung jawab dan tidak boleh dikirim ke create().
  draft: ({ prompt, projectId, maxTasks }) =>
    call('/web/v2/team/tasks/ai/draft', {
      prompt,
      project_id: projectId,
      ...(maxTasks ? { max_tasks: maxTasks } : {}),
    }),

  // Jalur cepat: satu kalimat -> satu tugas, langsung tersimpan. Tanpa
  // langkah tinjauan, jadi backend menugaskan ke pemanggil kalau kalimatnya
  // tidak menyebut nama siapa pun. Respons selalu membawa `interpretasi`
  // supaya tanggal yang salah baca langsung kelihatan.
  // projectId boleh kosong — backend memilih dari proyek aktif, dan menolak
  // dengan code 'need_project' kalau tidak yakin.
  quick: ({ prompt, projectId = null, dryRun = false }) =>
    call('/web/v2/team/tasks/ai/quick', {
      prompt,
      ...(projectId ? { project_id: projectId } : {}),
      ...(dryRun ? { dry_run: true } : {}),
    }),

  // Simpan hasil tinjauan. Kirim prompt aslinya juga — dicatat di chatter
  // tugas dan proyek, satu-satunya cara menjawab "kenapa tugas ini ada"
  // beberapa bulan kemudian.
  create: ({ projectId, tasks, prompt }) =>
    call('/web/v2/team/tasks/ai/create', {
      project_id: projectId,
      tasks,
      prompt,
    }),
}
