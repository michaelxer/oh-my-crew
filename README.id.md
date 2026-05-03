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

Wizard yang direkomendasikan:

```bash
npx oh-my-crew install
```

atau:

```bash
bunx oh-my-crew install
```

Untuk setup non-interaktif/scripted, lihat [docs/guide/installation.md](docs/guide/installation.md).

Wizard akan bertanya terlebih dahulu apakah Anda anggota Mettle Community dengan paket AXR AI Trial atau Pro. Jika dipilih, installer mengambil katalog model live dari `https://api.axrai.app/v1/models.json` dan hanya memakai model yang tersedia pada tier tersebut.

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

## Fitur dari Upstream

Fork ini mewarisi semua fitur dari oh-my-openagent:

| Fitur | Deskripsi |
|-------|-----------|
| **Discipline Agents** | Captain mengorkestrasi Strategist, Sage, Scribe, Scout secara paralel |
| **`ultrawork` / `ulw`** | Satu kata mengaktifkan semua agen. Berjalan sampai selesai |
| **IntentGate** | Menganalisis niat sebenarnya dari pengguna sebelum bertindak |
| **Hash-Anchored Edits** | Hash konten `LINE#ID` memvalidasi setiap perubahan. Nol error baris basi |
| **LSP + AST-Grep** | Refactoring presisi setara IDE untuk agen |
| **Background Agents** | 5+ spesialis berjalan secara paralel |
| **Built-in MCPs** | Exa (pencarian web), Context7 (dokumentasi), Grep.app (pencarian GitHub) |
| **Ralph Loop** | Loop self-referential sampai 100% selesai |
| **Architect Planner** | Perencanaan strategis mode wawancara sebelum eksekusi |
| **Claude Code Compatible** | Semua hook, command, skill, dan MCP berfungsi tanpa perubahan |
| **Session Guardian** | Auto git checkpoint, pemantauan konteks, dokumen handoff terstruktur untuk kerja multi-sesi yang mulus |

Untuk dokumentasi lengkap, lihat [proyek upstream](https://github.com/code-yeongyu/oh-my-openagent).

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
