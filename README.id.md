<div align="center">

# Oh My Crew

### Fork berbasis peran agen dari [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

Nama agen yang bersih dan deskriptif dengan system prompt yang aman dari content filter untuk penyedia proxy AI.

[![npm version](https://img.shields.io/npm/v/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)
[![GitHub stars](https://img.shields.io/github/stars/michaelxer/oh-my-crew?style=social)](https://github.com/michaelxer/oh-my-crew)
[![npm downloads](https://img.shields.io/npm/dm/oh-my-crew)](https://www.npmjs.com/package/oh-my-crew)

[English](README.md) | [Bahasa Indonesia](README.id.md)

</div>

---

## Dokumentasi Pengguna

- **Mulai di sini:** [Panduan Pengguna OMC yang ramah pemula](docs/guide/user-guide.id.md)
- **English:** [OMC User Guide](docs/guide/user-guide.md)
- **Instalasi:** [Panduan Instalasi](docs/guide/installation.md)
- **Referensi lanjutan:** [Referensi Fitur Lengkap](docs/reference/features.md)

## Apa ini?

**Oh My Crew** adalah fork dari [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (oleh [@code-yeongyu](https://github.com/code-yeongyu)), berbasis [oh-my-china](https://github.com/enowdev/oh-my-china) (oleh [@enowdev](https://github.com/enowdev)), dengan modifikasi berikut:

1. **System prompt disesuaikan** agar lolos content filter proxy AI
2. **Semua agen diganti namanya** menjadi nama kru yang bersih dan deskriptif -- tanpa referensi politik, budaya, atau mitologi

### Daftar Agen

| Asli | Nama Kru | Peran |
|------|----------|-------|
| Sisyphus | **Captain** | Orkestrator utama. Mengarahkan jalannya operasi. |
| Hephaestus | **Strategist** | Pekerja mandiri. Merencanakan dan mengeksekusi. |
| Oracle | **Sage** | Konsultan read-only. Memberi masukan tanpa mengubah apa pun. |
| Librarian | **Scribe** | Pencari dokumentasi eksternal. Menemukan referensi tertulis. |
| Explore | **Scout** | Pencari codebase. Spesialis rekognisi. |
| Atlas | **Foreman** | Orkestrator todo. Menjaga pekerjaan tetap pada jalurnya. |
| Prometheus | **Architect** | Perencana strategis. Merancang sebelum membangun. |
| Metis | **Advisor** | Konsultan pra-perencanaan. Mengidentifikasi risiko. |
| Momus | **Auditor** | Peninjau/kritikus rencana. Gerbang kualitas. |
| Sisyphus-Junior | **Cadet** | Pelaksana tugas. Mengikuti perintah. |
| Multimodal Looker | **Lookout** | Analisis gambar/PDF. Pengamat bermata tajam. |

### Perbaikan Content Filter

Frasa `"Powerful AI Agent"` yang dikombinasikan dengan direktif override identitas memicu content filter di beberapa proxy AI. Fork ini menggantinya dengan frasa yang lebih halus agar bisa lolos.

### Session Guardian (BARU)

Skill bawaan yang memberikan agen **manajemen siklus hidup sesi secara otonom**:

| Fitur | Fungsi |
|-------|--------|
| **Git Checkpoints** | Auto-commit setelah setiap tugas selesai. Satu commit per tugas, pesan commit konvensional. |
| **Context Monitoring** | Melacak penggunaan context window melalui heuristik + sinyal sistem. Tahu kapan harus berhenti. |
| **Smart Handoff Timing** | Tidak pernah menginterupsi di tengah tugas. Menyelesaikan pekerjaan saat ini terlebih dahulu, baru membuat handoff. |
| **Structured Handoff Docs** | Menghasilkan `HANDOFF_DOC/handoff-NNN.md` dengan konteks lengkap untuk sesi berikutnya. |
| **Chain Continuity** | Setiap handoff membawa keputusan dan konteks dari SEMUA sesi sebelumnya. |
| **Copy-Paste Resume** | Menghasilkan prompt siap-tempel untuk memulai sesi berikutnya dengan mulus. |
| **Credentials Protection** | Mengelola folder `.credentials/` untuk API key, token, dan password. Otomatis ditambahkan ke `.gitignore`. Agen tidak pernah meng-hardcode secret di source code. |

**Cara kerjanya:**

```text
Agen bekerja -> menyelesaikan tugas -> git commit -> cek level konteks
  |- Konteks OK -> lanjut ke tugas berikutnya
  \- Konteks tinggi (65%+) -> buat handoff -> berikan prompt resume -> berhenti
```

File handoff disimpan di `HANDOFF_DOC/` di root proyek Anda (otomatis ditambahkan ke `.gitignore`). Kredensial sensitif disimpan di `.credentials/` (juga otomatis di-gitignore). Saat memulai sesi baru, tempel prompt yang disediakan dan agen akan melanjutkan tepat dari posisi terakhir.

Session Guardian **dimuat otomatis** untuk Captain dan Strategist -- tidak perlu konfigurasi.

---

## Instalasi

### Prasyarat

- [OpenCode](https://opencode.ai/docs) sudah terinstal
- [Node.js](https://nodejs.org/) sudah terinstal (sudah termasuk npm)

### Langkah 1: Tambahkan ke konfigurasi plugin

#### Instalasi dipandu agent

Tempel ini ke sesi LLM agent Anda. Agent akan bertanya di chat, lalu menjalankan installer dengan `--no-tui` supaya command terminal tidak membuka menu:

```text
Install and configure oh-my-crew by following the instructions here:
https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
```

LLM agent sebaiknya mengambil panduan dengan:

```bash
curl -fsSL https://raw.githubusercontent.com/michaelxer/oh-my-crew/refs/heads/oh-my-crew/docs/guide/installation.md
```

#### Wizard terminal

Jika Anda menginstal sendiri, jalankan ini di terminal sungguhan. Wizard terminal akan menanyakan pertanyaan setup yang sama di sana:

```bash
npx oh-my-crew@latest install
```

atau:

```bash
bunx oh-my-crew@latest install
```

#### Update instalasi yang sudah ada

Sudah terinstal? Jalankan command yang sama lagi, lalu restart OpenCode sepenuhnya:

```bash
npx oh-my-crew@latest install
```

Installer menjaga provider setting, menghapus entri plugin legacy yang duplikat, menulis ulang visible crew agent/MCP entries, dan me-refresh `oh-my-crew.json`. Jika OpenCode masih menampilkan agen lama atau agen hilang setelah restart, lihat langkah clean update di [Panduan Pengguna OMC](docs/guide/user-guide.id.md#update-omc).

Package npm menjalankan installer JS secara langsung, jadi instalasi normal lewat `npx`/`bunx` tidak membutuhkan package binary Windows, Linux, atau macOS terpisah.

Untuk setup scripted dan instruksi lengkap untuk LLM agent, lihat [docs/guide/installation.md](docs/guide/installation.md). Di project ini, `--no-tui` berarti "tanpa menu terminal"; bukan berarti "tanpa pertanyaan". Agent tetap bisa bertanya di chat lalu mengirim jawaban Anda sebagai flag.

Installer yang sama bisa dipakai untuk pengguna AXR AI maupun setup publik dengan provider sendiri. Jika Anda memilih AXR AI Trial atau Pro, OMC mengambil katalog model live dari `https://api.axrai.app/v1/models.json`, menulis konfigurasi provider AXR, dan memasang model kru hanya dari plan tersebut. Jika Anda tidak memakai AXR AI, wizard akan lanjut bertanya tentang Claude, OpenAI/ChatGPT, Gemini, Copilot, OpenCode Zen, Z.ai, Kimi, OpenCode Go, Vercel AI Gateway, dan custom provider OpenAI-compatible.

Di akhir proses, installer menulis konfigurasi plugin OpenCode, menulis `oh-my-crew.json`, lalu menampilkan assignment model untuk kru beserta command verifikasi.

Konfigurasi manual juga tetap didukung.

Edit `~/.config/opencode/opencode.json` (atau `opencode.jsonc`) dan tambahkan `"oh-my-crew"` ke array plugin:

```json
{
  "plugin": ["oh-my-crew"]
}
```

> **Direkomendasikan:** Gunakan `"oh-my-crew"` saja. Plugin ini sudah mencakup semua yang Anda butuhkan dari OMO dan menghindari duplikasi dropdown serta konflik routing sub-agent.
>
> **Penting:** Jika Anda tetap menyimpan `"oh-my-openagent@latest"` bersamaan dengan OMC, Anda mungkin mendapat entri dropdown duplikat dan prompt sub-agent OMO lama masih bisa aktif saat runtime. Untuk setup paling bersih, hapus OMO dan jalankan OMC secara independen.

### Langkah 2: Restart OpenCode

OpenCode akan otomatis menginstal plugin dari npm saat startup. Jika agen kru tidak muncul, instal secara manual:

```bash
cd ~/.config/opencode
npm install oh-my-crew --save
```

Kemudian restart OpenCode lagi.

### Langkah 3: Verifikasi

```bash
opencode
opencode agent list
# Anda seharusnya melihat Captain, Strategist, Foreman, Sage, dll. di dropdown/list agen
# Ketik "ultrawork" untuk mengaktifkan semua agen
```

### Konfigurasi penyedia proxy Anda

```json
{
  "provider": {
    "your-proxy": {
      "type": "openai",
      "url": "http://your-proxy:port/v1",
      "key": "your-api-key"
    }
  }
}
```

---

## Instal dari source (untuk developer)

Hanya diperlukan jika Anda ingin memodifikasi kodenya:

```bash
git clone https://github.com/michaelxer/oh-my-crew.git
cd oh-my-crew
bun install
bun run build
bun link
```

Kemudian tambahkan `"oh-my-crew"` ke array plugin di `opencode.json` Anda.

---

## Ringkasan Fitur

Oh My Crew mempertahankan kekuatan orkestrasi dari upstream dan menambahkan penamaan, instalasi, serta kontinuitas sesi khas OMC. Versi singkatnya:

| Fitur | Deskripsi |
|-------|-----------|
| **Agen Kru** | Nama peran yang jelas seperti Captain, Strategist, Architect, Foreman, Sage, Scout, Scribe, dan Lookout. |
| **`ultrawork` / `ulw`** | Satu keyword membuat OMC memahami tugas, mengoordinasi agen, mengeksekusi, dan memverifikasi sampai selesai. |
| **Architect / Planner Mode** | Workflow planning-first untuk pekerjaan berisiko atau belum jelas sebelum file diubah. |
| **Team Mode** | Membuat tim multi-agent sementara dengan pesan, task, dan status bersama. |
| **Hyperplan** | Mode planning adversarial: beberapa agen menantang asumsi sebelum rencana final dibuat. |
| **Background Agents** | Spesialis bisa riset, implementasi, atau review secara paralel saat agen utama tetap berjalan. |
| **Session Guardian** | Git checkpoint, pemantauan konteks, dokumen handoff, prompt resume, dan perlindungan credentials. |
| **Built-in MCPs** | Web search, pencarian dokumentasi Context7, dan pencarian kode grep.app/GitHub jika tersedia. |
| **LSP + AST-Grep** | Navigasi seperti IDE dan pencarian/refactor berbasis struktur agar edit lebih aman. |
| **Model Fallbacks** | Agen bisa lanjut memakai model cadangan saat provider atau model utama tidak tersedia. |
| **Claude Code Compatibility** | Banyak hook, command, skill, agent, dan config MCP bergaya Claude Code bisa digunakan ulang. |
| **Installer** | Setup terpandu untuk OpenCode, assignment model, pilihan provider, AXR AI, dan backup config. |

Untuk panduan non-teknis dengan contoh dan use case, baca [Panduan Pengguna OMC](docs/guide/user-guide.id.md). Untuk pengguna Inggris, baca [OMC User Guide](docs/guide/user-guide.md). Untuk detail teknis lengkap, lihat [Referensi Fitur](docs/reference/features.md) dan [proyek upstream](https://github.com/code-yeongyu/oh-my-openagent).

---

## Sinkronisasi dengan Upstream

Ini adalah fork GitHub yang proper. Untuk menarik perubahan upstream terbaru:

```bash
git remote add upstream https://github.com/code-yeongyu/oh-my-openagent.git
git fetch upstream
git merge upstream/dev
```

---

## Kredit

Proyek ini berbasis pada:

- **[oh-my-opencode / oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)** oleh **[@code-yeongyu](https://github.com/code-yeongyu)** (YeonGyu Kim) -- arsitektur asli, agen, tool, hook, dan semua fitur inti
- **[oh-my-china](https://github.com/enowdev/oh-my-china)** oleh **[@enowdev](https://github.com/enowdev)** -- fork kompatibel Tiongkok dengan perbaikan content filter yang menjadi dasar proyek ini

Fork ini mengganti nama semua agen dari tema budaya/politik menjadi nama kru yang bersih dan deskriptif sambil mempertahankan semua fungsionalitas upstream.

- **Repo asli**: [github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
- **Fork China**: [github.com/enowdev/oh-my-china](https://github.com/enowdev/oh-my-china)
- **npm**: [oh-my-crew](https://www.npmjs.com/package/oh-my-crew)
- **npm (asli)**: [oh-my-opencode](https://www.npmjs.com/package/oh-my-opencode)
- **Lisensi**: [SUL-1.0](LICENSE.md) (diwarisi dari upstream)
- **Discord**: [Bergabung dengan komunitas](https://discord.gg/PUwSMR9XNk)

---

## Dukungan

Jika Anda merasa Oh My Crew bermanfaat, pertimbangkan untuk:

- Berikan [bintang di GitHub](https://github.com/michaelxer/oh-my-crew) agar lebih mudah ditemukan orang lain
- Laporkan masalah atau sarankan fitur di [GitHub Issues](https://github.com/michaelxer/oh-my-crew/issues)
- Bergabung dengan [komunitas Discord](https://discord.gg/PUwSMR9XNk) untuk berdiskusi

---

## Lisensi

Fork ini mengikuti [lisensi SUL-1.0](LICENSE.md) yang sama dengan proyek upstream.
Lihat [NOTICE.md](NOTICE.md) untuk detail modifikasi sesuai ketentuan lisensi.
