# Aturan Git & GitHub Workflow

## Remote Repository

- **Remote Origin:** `git@github.com:adhasangg/capstone-project.git`
- Pastikan SSH key sudah dikonfigurasi sebelum push/pull.
- Branch utama di remote: `main`.

## Inisialisasi Repository

```bash
# Inisialisasi git (jika belum)
git init
git remote add origin git@github.com:adhasangg/capstone-project.git
git branch -M main
git push -u origin main
```

## Branching Strategy (GitHub Flow)

| Tipe Branch    | Format Penamaan        | Contoh                    |
|----------------|------------------------|---------------------------|
| Fitur baru     | `feat/<nama-fitur>`    | `feat/otp-auth`           |
| Perbaikan bug  | `fix/<nama-bug>`       | `fix/socket-latency`      |
| Refactoring    | `refactor/<deskripsi>` | `refactor/split-chatbox`  |
| Setup/Config   | `chore/<deskripsi>`    | `chore/setup-biome`       |
| Dokumentasi    | `docs/<deskripsi>`     | `docs/api-reference`      |
| Testing        | `test/<deskripsi>`     | `test/e2e-auth-flow`      |

### Aturan Branch

- Selalu buat branch baru dari `main` yang sudah di-pull terbaru.
- Satu branch = satu fitur/task. Jangan campur beberapa task dalam satu branch.
- Hapus branch setelah berhasil di-merge ke `main`.

## Conventional Commits (WAJIB)

Format: `<type>(<scope>): <deskripsi singkat>`

### Tipe Commit

| Tipe       | Penggunaan                                      |
|------------|------------------------------------------------|
| `feat`     | Fitur baru                                     |
| `fix`      | Perbaikan bug                                  |
| `refactor` | Perubahan kode tanpa mengubah perilaku          |
| `test`     | Menambah atau memperbaiki tes                   |
| `chore`    | Setup, konfigurasi, dependency update           |
| `docs`     | Perubahan dokumentasi                           |
| `style`    | Perubahan formatting (bukan CSS, melainkan kode)|
| `perf`     | Peningkatan performa                            |

### Contoh Commit yang Benar

```
feat(api): implementasi endpoint OTP authentication
fix(web): perbaiki re-render berlebihan di ChatBubble
test(shared): tambah unit test untuk skema validasi user
refactor(api): pisahkan assessment logic ke service layer
chore: konfigurasi Biome linter dan formatter
```

### Aturan Commit

- ❌ **DILARANG** commit message generik: `fix bug`, `update`, `wip`, `asdf`.
- ❌ **DILARANG** commit file yang tidak terkait dalam satu commit.
- ✅ Setiap commit harus atomic — satu perubahan logis per commit.
- ✅ Commit message menggunakan **Bahasa Inggris** untuk konsistensi.

## Pull Request (PR)

- Judul PR mengikuti format Conventional Commits.
- Deskripsi PR harus menjelaskan:
  - **Apa** yang diubah.
  - **Mengapa** perubahan ini diperlukan.
  - **Cara menguji** perubahan ini.
- Wajib minimal 1 code reviewer sebelum merge.
- Semua tes harus lulus sebelum merge.
- Gunakan **Squash & Merge** untuk menjaga history `main` tetap bersih.

## GitNexus (Code Indexing)

- **GitNexus** digunakan sebagai tool code indexing untuk memudahkan navigasi dan pencarian kode di seluruh monorepo.
- Pastikan repository terhubung ke GitNexus setelah inisialisasi.
- Manfaatkan GitNexus untuk:
  - Mencari referensi fungsi/tipe data lintas workspace (`apps/*`, `packages/*`).
  - Melacak dependensi antar modul.
  - Code review dengan konteks yang lebih baik.

## .gitignore (Wajib)

Pastikan file berikut **TIDAK** masuk ke repository:

```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
bun.lockb
coverage/
```

## Larangan

- ❌ **DILARANG** push langsung ke branch `main` tanpa melalui PR.
- ❌ **DILARANG** force push (`git push --force`) ke branch yang sudah di-review orang lain.
- ❌ **DILARANG** commit file `.env`, secret key, atau data sensitif apapun.
- ❌ **DILARANG** commit file hasil build (`dist/`, `build/`).
