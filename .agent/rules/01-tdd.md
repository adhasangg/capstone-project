# Aturan Test-Driven Development (TDD)

Seluruh pengembangan fitur **WAJIB** mengikuti siklus TDD: **Red → Green → Refactor**.

## Siklus Wajib

1. **Red** — Tulis tes yang gagal terlebih dahulu.
2. **Green** — Tulis kode implementasi **seminimal mungkin** agar tes lulus.
3. **Refactor** — Bersihkan kode tanpa mengubah perilaku, pastikan tes tetap lulus.

## Aturan Penulisan Tes

### Backend (`apps/api`)

- Gunakan **Bun Test Runner** (`bun:test`) sebagai test framework utama.
- Struktur folder tes: letakkan file `*.test.ts` di samping file yang diuji.
  ```
  apps/api/src/services/
  ├── assessment.service.ts
  └── assessment.service.test.ts
  ```
- Setiap **service function** harus memiliki minimal 1 test case untuk happy path dan 1 untuk error path.
- Setiap **route/controller** harus memiliki integration test menggunakan `Elysia.handle()` atau `fetch` ke server lokal.
- Mock external dependencies (database, LLM API) menggunakan `mock()` dari `bun:test`.

### Frontend (`apps/web`)

- Gunakan **Vitest** + **React Testing Library** untuk unit & component test.
- Struktur folder tes: letakkan file `*.test.tsx` di samping komponen.
  ```
  apps/web/src/components/
  ├── ChatBubble.tsx
  └── ChatBubble.test.tsx
  ```
- Setiap komponen interaktif harus memiliki test untuk:
  - Render tanpa error.
  - Interaksi pengguna utama (klik, input, submit).
  - State changes yang kritis.

### Packages (`packages/*`)

- Setiap fungsi utilitas atau skema validasi di `packages/shared` **wajib** memiliki unit test.
- Test coverage untuk packages harus ≥ 80%.

## Perintah Menjalankan Tes

```bash
# Jalankan semua tes dari root monorepo
bun test

# Jalankan tes untuk workspace tertentu
bun test --filter api
bun test --filter web

# Jalankan tes dengan coverage
bun test --coverage
```

## Larangan

- ❌ **DILARANG** menulis implementasi tanpa tes terlebih dahulu.
- ❌ **DILARANG** push ke remote jika ada tes yang gagal.
- ❌ **DILARANG** meng-skip atau men-disable tes tanpa alasan yang terdokumentasi di komentar.
- ❌ **DILARANG** menulis tes kosong (`test.todo()` tanpa implementasi dalam sprint yang sama).
