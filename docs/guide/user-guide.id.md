# Panduan Pengguna Oh My Crew

Panduan ini menjelaskan Oh My Crew dengan bahasa sederhana. Anda tidak perlu menjadi programmer untuk memakainya dengan baik. Anggap Oh My Crew sebagai cara mengubah satu chat OpenCode menjadi tim AI kecil dengan tugas yang berbeda-beda.

Jika belum menginstal, mulai dari [Panduan Instalasi](./installation.md).

## Ide Sederhananya

OpenCode biasanya memberi Anda satu asisten AI. Oh My Crew menambahkan beberapa asisten khusus:

- Ada agen yang memimpin pekerjaan.
- Ada agen yang mencari informasi.
- Ada agen yang membuat rencana.
- Ada agen yang meninjau hasil.
- Ada agen yang bisa bekerja di background saat chat utama tetap berjalan.

Anda tetap bisa berbicara seperti biasa. Anda tidak perlu mengatur semua agen satu per satu. Biasanya cukup jelaskan hasil yang Anda inginkan, lalu OMC memilih alur kerja yang cocok.

## Mulai Cepat

Setelah instalasi dan restart OpenCode, coba salah satu prompt ini.

```text
ultrawork
Tolong cek project ini, pahami fungsinya, cari masalah yang terlihat jelas, perbaiki yang aman untuk diperbaiki, lalu verifikasi hasilnya.
```

```text
Saya ingin menambahkan fitur baru, tapi buat rencana dulu. Tanyakan hal penting sebelum mengubah file.
```

```text
hyperplan
Saya ingin rencana terbaik untuk meluncurkan aplikasi ini. Tantang ide ini dari beberapa sudut sebelum membuat rencana akhir.
```

```text
team mode
Gunakan tim kecil untuk riset, membuat rencana, dan review tugas ini sebelum implementasi.
```

## Fitur Utama

### Agen Kru

OMC memberi setiap agen nama peran yang jelas. Anda bisa memakainya dengan bahasa natural:

| Agen | Cocok Untuk | Contoh prompt |
| --- | --- | --- |
| Captain | Memimpin pekerjaan kompleks sampai selesai | `Captain, selesaikan tugas ini end to end dan verifikasi.` |
| Strategist | Implementasi mendalam dan debugging | `Minta Strategist menyelidiki kenapa ini terus gagal.` |
| Architect | Membuat rencana sebelum membangun | `Gunakan Architect untuk membuat rencana sebelum mengubah kode.` |
| Foreman | Menjalankan rencana langkah demi langkah | `Foreman, kerjakan rencana ini dan jaga task tetap rapi.` |
| Sage | Saran read-only dan review arsitektur | `Minta Sage review desain ini tanpa mengedit file.` |
| Scout | Pencarian cepat di project | `Minta Scout mencari lokasi alur login.` |
| Scribe | Dokumentasi dan contoh eksternal | `Minta Scribe mencari dokumentasi resmi dan contoh untuk library ini.` |
| Advisor | Mencari risiko tersembunyi sebelum planning | `Minta Advisor mencari hal yang mungkin terlewat.` |
| Auditor | Review rencana atau hasil kerja | `Minta Auditor cek bug, regresi, dan test yang kurang.` |
| Cadet | Tugas kecil yang didelegasikan | Biasanya dipakai otomatis oleh OMC. |
| Lookout | Gambar, screenshot, dan PDF | `Minta Lookout melihat screenshot ini dan jelaskan masalahnya.` |

Anda tidak harus menghafal semua nama ini. Untuk penggunaan normal, mulai dari `ultrawork`, `team mode`, atau prompt planning.

### `ultrawork` / `ulw`

Gunakan `ultrawork` saat Anda ingin OMC mengambil tugas besar dan mendorongnya sampai selesai.

Fungsinya:

- Memahami project sebelum bertindak.
- Memecah permintaan menjadi tugas kecil.
- Menggunakan agen riset, planning, coding, dan review saat diperlukan.
- Terus bekerja sampai tugas benar-benar selesai.
- Memverifikasi dengan test, build, atau pengecekan lain jika tersedia.

Cocok untuk:

- "Perbaiki bug ini dan verifikasi."
- "Tambahkan fitur ini di seluruh aplikasi."
- "Baca project dan lanjutkan tugas yang belum selesai."
- "Rapikan release ini dan siapkan untuk publish."

Contoh:

```text
ulw
Tambahkan halaman settings untuk preferensi notifikasi. Ikuti desain yang sudah ada, update test, dan verifikasi build.
```

### Architect / Planner Mode

Gunakan mode planning saat pekerjaan penting, belum jelas, atau berisiko. Agen sebaiknya bertanya dan membuat rencana sebelum mengubah file.

Fungsinya:

- Memperjelas apa yang Anda inginkan.
- Menemukan keputusan yang belum dibuat.
- Membuat rencana terstruktur.
- Memberi Anda kesempatan review sebelum eksekusi.
- Cocok untuk project multi-hari, refactor besar, launch, dan perubahan production.

Contoh:

```text
Plan first. Saya ingin redesign alur onboarding. Tanyakan pertanyaan penting, lalu buat rencana bertahap dengan risiko dan cara verifikasi.
```

Setelah rencana siap, Anda bisa berkata:

```text
Start work on this plan.
```

### Team Mode

Team Mode membuat OMC menjalankan grup agen untuk satu pekerjaan terkoordinasi. Ini berguna saat Anda ingin beberapa sudut pandang sekaligus, bukan hanya satu asisten yang berpikir sendiri.

Fungsinya:

- Membuat team run sementara.
- Memberi anggota tim tugas masing-masing.
- Memungkinkan anggota mengirim pesan dan berbagi temuan.
- Melacak task dan status tim.
- Membersihkan resource saat selesai.

Cocok untuk:

- Meriset keputusan besar.
- Membandingkan beberapa opsi implementasi.
- Satu anggota implementasi, anggota lain review.
- Membagi pekerjaan frontend, backend, dan testing.

Cara mengaktifkan:

```jsonc
{
  "team_mode": {
    "enabled": true
  }
}
```

Taruh ini di `~/.config/opencode/oh-my-crew.jsonc`, lalu restart OpenCode.

Contoh:

```text
team mode
Buat tim untuk tugas ini: satu anggota meriset kode saat ini, satu mengusulkan rencana, satu review risiko, dan satu mengecek test. Setelah itu beri saya rekomendasi final.
```

### Hyperplan

Hyperplan adalah workflow planning khusus yang dibangun di atas Team Mode. Ini untuk keputusan serius ketika Anda ingin rencana diuji keras sebelum dipercaya.

Fungsinya:

- Memulai tim planning yang saling mengkritik.
- Setiap anggota menganalisis masalah secara mandiri.
- Anggota menyerang asumsi anggota lain.
- Anggota mempertahankan, memperbaiki, atau mengakui kelemahan idenya.
- Agen planning final mengubah ide terkuat menjadi rencana.

Cocok untuk:

- Rencana launch produk.
- Keputusan arsitektur.
- Perubahan yang sensitif terhadap keamanan.
- "Saya ingin rencana terbaik, bukan rencana pertama."

Cara memakai:

```text
hyperplan
Saya ingin migrasi aplikasi ini ke sistem auth baru. Tantang opsinya, cari risiko, lalu buat rencana terbaik.
```

Team Mode harus aktif agar Hyperplan bisa berjalan.

### Background Agents

Background agents membuat OMC bisa mengerjakan lebih dari satu hal sekaligus.

Fungsinya:

- Mengirim tugas riset atau review ke agen lain.
- Membiarkan agen utama tetap bekerja.
- Memberi laporan saat pekerjaan background selesai.
- Bisa dipakai untuk riset paralel, implementasi, review, atau testing.

Cocok untuk:

- Satu agen mencari kode terkait saat agen lain memperbaiki bug.
- Satu agen mengecek dokumentasi saat agen lain menulis fitur.
- Beberapa agen review bagian berbeda dari perubahan besar.

Biasanya Anda tidak perlu memanggil tool background secara manual. Cukup beri instruksi:

```text
Gunakan background agents jika membantu. Saya ingin satu agen meriset API, satu memeriksa pola yang sudah ada, dan satu mereview perubahan akhir.
```

### Session Guardian

Session Guardian membantu pekerjaan panjang tetap aman walau harus dilanjutkan di sesi OpenCode berikutnya.

Fungsinya:

- Membuat git checkpoint setelah tugas selesai.
- Memantau pemakaian konteks agar sesi tidak rusak di waktu yang buruk.
- Membuat dokumen handoff di `HANDOFF_DOC/`.
- Memberi prompt resume untuk sesi berikutnya.
- Menjaga secret di `.credentials/`, bukan di-hardcode ke kode.

Cocok untuk:

- Refactor panjang.
- Persiapan release.
- Debugging multi-sesi.
- Pekerjaan yang butuh jejak jelas: apa berubah dan kenapa.

Biasanya tidak perlu diaktifkan manual. Session Guardian dimuat otomatis untuk Captain dan Strategist.

### Built-In MCPs

MCP adalah sumber informasi atau tool tambahan. Bahasa sederhananya: MCP membantu agen mencari informasi atau memakai layanan khusus.

OMC menyertakan:

- Web search untuk informasi terbaru jika tersedia.
- Context7 untuk dokumentasi resmi library.
- Grep.app untuk mencari contoh kode di GitHub publik.

Cocok untuk:

- "Cek dokumentasi resmi sebelum mengubah ini."
- "Cari contoh bagaimana project lain memakai library ini."
- "Cari info terbaru tentang perilaku API ini."

Contoh:

```text
Sebelum coding, gunakan dokumentasi resmi dan contoh publik untuk memastikan pendekatan yang benar.
```

### LSP Dan AST-Grep Tools

Ini adalah tool navigasi dan perubahan kode yang lebih aman.

Bahasa sederhananya:

- LSP memberi agen fitur seperti IDE, misalnya "go to definition" dan "find references."
- AST-Grep membuat agen mencari kode berdasarkan struktur, bukan hanya teks.

Cocok untuk:

- Rename function dengan lebih aman.
- Mencari semua tempat fitur dipakai.
- Refactor tanpa menebak-nebak.
- Mengecek masalah sebelum build gagal.

Contoh:

```text
Gunakan code navigation tools sebelum refactor. Cari semua reference dulu, lalu ubah dengan aman.
```

### Model Fallbacks

Model fallback berarti OMC bisa mencoba model cadangan saat model utama tidak tersedia.

Membantu saat:

- Provider sedang bermasalah.
- Terkena rate limit.
- Akses ke model tertentu belum ada.
- Agen berbeda butuh kekuatan model yang berbeda.

Contoh:

```text
Jika model utama tidak tersedia, gunakan fallback yang sudah dikonfigurasi dan lanjutkan.
```

### Installer Dan Provider Setup

OMC punya installer supaya Anda tidak perlu mengedit semua config secara manual.

Fungsinya:

- Menambahkan `oh-my-crew` ke OpenCode.
- Menulis `oh-my-crew.json`.
- Menjaga provider setting yang sudah ada.
- Membantu konfigurasi Claude, OpenAI, Gemini, Copilot, OpenCode Zen, OpenCode Go, Z.ai, Kimi, Vercel AI Gateway, AXR AI, atau provider custom OpenAI-compatible.
- Membuat backup config sebelum menulis perubahan.

Gunakan:

```bash
npx oh-my-crew@latest install
```

### Update OMC

Jika OMC sudah terinstal, update dengan menjalankan installer yang sama:

```bash
npx oh-my-crew@latest install
```

Lalu restart OpenCode sepenuhnya.

Alur update ini menjaga provider setting Anda, membuat backup config, menghapus entri plugin lama yang duplikat, menulis ulang visible crew agent/MCP entries, dan me-refresh `oh-my-crew.json`.

Jika setelah restart OpenCode masih menampilkan agen lama atau agen hilang, tutup OpenCode sepenuhnya lalu bersihkan hanya cache package OMC:

Windows PowerShell:

```powershell
$pkg = Join-Path $env:USERPROFILE ".cache\opencode\packages\node_modules"
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-crew") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-opencode") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath (Join-Path $pkg "oh-my-openagent") -Recurse -Force -ErrorAction SilentlyContinue
npx oh-my-crew@latest install
```

macOS / Linux:

```bash
rm -rf "$HOME/.cache/opencode/packages/node_modules/oh-my-crew" \
       "$HOME/.cache/opencode/packages/node_modules/oh-my-opencode" \
       "$HOME/.cache/opencode/packages/node_modules/oh-my-openagent"
npx oh-my-crew@latest install
```

Jangan hapus seluruh folder config OpenCode untuk update normal.

Untuk setup dipandu agen, tempel:

```text
Install and configure oh-my-crew by following the instructions here:
https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
```

### Claude Code Compatibility

OMC bisa membaca banyak setting, command, skill, hook, agent, dan MCP bergaya Claude Code.

Artinya:

- Jika Anda sudah punya workflow Claude Code, banyak yang bisa dipakai lagi.
- Skill dan command project bisa digunakan ulang.
- Tim tidak harus menulis ulang semua instruksi.

Anda tidak membutuhkan ini untuk penggunaan dasar.

### Hooks Dan Recovery

Hooks adalah helper otomatis yang berjalan pada momen penting.

Hooks bisa:

- Mendeteksi keyword seperti `ultrawork`, `hyperplan`, dan `team mode`.
- Memulihkan masalah API atau pesan yang umum terjadi.
- Mencegah file tertimpa terlalu sembarangan.
- Menjaga konteks penting selama sesi panjang.
- Menampilkan notifikasi update.
- Mengingatkan agen untuk memakai spesialis yang tepat.

Anda tidak perlu mengoperasikan hooks secara manual. Hooks bekerja di background.

### Slash Commands Dan Skills

Skills adalah instruksi yang bisa digunakan ulang untuk jenis pekerjaan tertentu. Slash commands adalah shortcut workflow.

Cocok untuk:

- Browser testing.
- Merapikan git.
- Refactoring.
- Review workflow.
- Tugas project yang sering diulang.

Contoh:

```text
Gunakan skill yang relevan untuk tugas ini dan jelaskan skill apa yang dipakai.
```

## Mode Mana Yang Harus Dipakai?

| Situasi | Pakai |
| --- | --- |
| Anda ingin agen mengurus semuanya | `ultrawork` atau `ulw` |
| Tugas berisiko atau belum jelas | Architect / planning mode |
| Anda ingin beberapa agen berdiskusi atau membagi kerja | Team Mode |
| Anda ingin rencana dikritik dari banyak sudut | Hyperplan |
| Anda ingin saran tanpa edit file | Sage |
| Anda ingin pencarian cepat di project | Scout |
| Anda ingin dokumentasi atau contoh web | Scribe |
| Anda bekerja dalam waktu lama | Session Guardian |

## Resep Prompt Untuk Pemula

### Memperbaiki Bug

```text
ultrawork
Cari kenapa bug ini terjadi, perbaiki, lalu verifikasi hasilnya. Setelah selesai, jelaskan penyebabnya dengan bahasa sederhana.
```

### Menambah Fitur

```text
Buat rencana singkat, lalu implementasikan fitur ini. Ikuti gaya project yang sudah ada, update test jika perlu, dan verifikasi hasilnya.
```

### Review Pekerjaan

```text
Review perubahan saat ini untuk bug, regresi, test yang kurang, dan kode yang membingungkan. Jangan ubah file kecuali ada fix yang jelas.
```

### Memahami Project

```text
Baca project ini dan jelaskan fungsinya dengan bahasa sederhana. Setelah itu beri tahu langkah berikutnya yang paling aman.
```

### Membuat Rencana Serius

```text
hyperplan
Saya butuh rencana kuat untuk project ini. Tantang asumsi, bandingkan opsi, identifikasi risiko, dan beri saya rencana final terbaik.
```

### Melanjutkan Dari Handoff

```text
Baca semua file di HANDOFF_DOC, pahami status terbaru, lalu lanjutkan tugas yang belum selesai. Cek repo sebelum mengedit.
```

## Tips Praktis

- Jelaskan hasil yang Anda inginkan, bukan hanya tindakan.
- Katakan apakah agen boleh edit file, menjalankan test, commit, push, atau publish.
- Untuk pekerjaan berisiko, minta rencana dulu.
- Untuk pekerjaan hands-off, pakai `ultrawork`.
- Untuk keputusan besar, pakai `hyperplan`.
- Restart OpenCode setelah mengubah plugin atau config OMC.
- Jangan pernah menempel API key ke chat. Gunakan OpenCode auth atau environment variables.

## Troubleshooting

### Agen tidak muncul

Restart OpenCode. Perubahan plugin dimuat saat OpenCode mulai.

Jika masih tidak muncul, jalankan:

```bash
npx oh-my-crew@latest install
```

Jika masih hilang setelah restart penuh, gunakan langkah cleanup cache di [Update OMC](#update-omc).

### Team Mode atau Hyperplan bilang tools hilang

Aktifkan Team Mode:

```jsonc
{
  "team_mode": {
    "enabled": true
  }
}
```

Simpan di `~/.config/opencode/oh-my-crew.jsonc`, lalu restart OpenCode.

### Provider atau model gagal

Cek login provider dulu:

```bash
opencode auth login
```

Jika fallback sudah dikonfigurasi, OMC bisa lanjut memakai model lain.

### Sesi saat ini terlalu panjang

Biarkan Session Guardian membuat handoff, lalu mulai sesi baru dengan prompt resume.

## Bacaan Lanjutan

- [Panduan Instalasi](./installation.md)
- [Panduan Orkestrasi](./orchestration.md)
- [Panduan OMC Agent-Model Matching](./omc-agent-model-matching.md)
- [Referensi Konfigurasi](../reference/configuration.md)
- [Referensi Fitur](../reference/features.md)
