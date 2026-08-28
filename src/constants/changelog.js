// src/constants/changelog.js
//
// Sumber tunggal catatan rilis aplikasi.
//
// PENTING: entri paling atas = versi terbaru, dan HARUS sama dengan
// "version" di package.json. Saat build, entri teratas ini di-generate
// menjadi /version.json yang dipakai aplikasi lama untuk mendeteksi
// bahwa ada pembaruan (lihat plugin "pitcar-version-manifest" di vite.config.js).
//
// Field:
//   version    : nomor versi semver, harus sinkron dengan package.json
//   date       : tanggal rilis (YYYY-MM-DD)
//   title      : judul singkat yang tampil di popup pembaruan
//   mandatory  : true = popup tidak bisa ditutup, user wajib update
//   highlights : daftar perubahan yang ditampilkan ke user (bahasa non-teknis)

export const CHANGELOG = [
  {
    version: '3.3.1',
    date: '2026-08-29',
    title: 'Perbaikan Bug',
    mandatory: false,
    highlights: [
      'Perbaikan bug pada halaman Projects',
      'Perbaikan bug pada halaman Tasks'
    ]
  },
  {
    version: '3.3.0',
    date: '2026-08-28',
    title: 'Info tim project & notifikasi pembaruan',
    mandatory: false,
    highlights: [
      'Anggota tim project dan project leader kini tampil di halaman Projects dan Tasks',
      'Aplikasi otomatis memberi tahu saat ada versi baru dan mengingatkan untuk update',
      'Perbaikan tata letak kartu project di layar kecil'
    ]
  },
  {
    version: '3.2.9',
    date: '2026-08-27',
    title: 'Perbaikan input tanggal',
    mandatory: false,
    highlights: [
      'Perbaikan pembacaan tanggal & waktu pada form project dan task',
      'Tampilan pemilihan project pada halaman Tasks'
    ]
  }
]

// Rilis terbaru — dipakai vite.config.js untuk membuat /version.json
export const LATEST_RELEASE = CHANGELOG[0]

/**
 * Bandingkan dua nomor versi semver sederhana.
 * @returns {number} 1 bila a > b, -1 bila a < b, 0 bila sama
 */
export function compareVersions(a, b) {
  const parse = (value) =>
    String(value ?? '0')
      .split('.')
      .map((part) => parseInt(part, 10) || 0)

  const left = parse(a)
  const right = parse(b)
  const length = Math.max(left.length, right.length)

  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0)
    if (diff !== 0) return diff > 0 ? 1 : -1
  }

  return 0
}
