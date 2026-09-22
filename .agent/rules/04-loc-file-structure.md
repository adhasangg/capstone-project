# Aturan Lines of Code (LOC) & Struktur File

Output kode **WAJIB** modular dan terpecah sesuai arsitektur Bun Workspace. **DILARANG** menghasilkan "god file" — satu file besar berisi seluruh logika.

## Batas LOC per File

| Bagian Aplikasi                        | Min   | Maks Ideal | Catatan                                                  |
|----------------------------------------|-------|-----------|----------------------------------------------------------|
| Backend Route / Controller             | 10    | 150       | Hanya routing dan validasi input awal.                   |
| Backend Business Logic (Service)       | 20    | 300       | Tempat logika bisnis utama berada.                       |
| Backend Repository / Data Access       | 10    | 200       | Khusus query database (Drizzle ORM).                     |
| Frontend Component (React)             | 10    | 200       | Jika >200, pecah menjadi sub-komponen.                   |
| Frontend Custom Hook                   | 5     | 100       | Satu hook = satu concern.                                |
| Frontend Page                          | 10    | 250       | Komposisi komponen, bukan logika langsung.                |
| File Konfigurasi / Tipe Data (TS)      | 5     | 500       | Tergantung jumlah skema/interface.                       |
| File Utilitas / Helper                 | 5     | 150       | Satu file = satu domain utilitas.                        |
| File Test                              | 10    | 400       | Boleh lebih panjang karena sifat deskriptif dari tes.    |

> [!IMPORTANT]
> Jika sebuah file mendekati atau melebihi batas maksimal, itu adalah sinyal kuat bahwa file tersebut harus di-refactor dan dipecah.

## Strategi Pemecahan File (Anti God-File)

### 1. Backend — Struktur Layered

Jika AI menghasilkan satu file API besar, **WAJIB** pecah menjadi 3 layer:

```
apps/api/src/modules/auth/
├── auth.route.ts          # Route: terima HTTP request, panggil service  (≤150 LOC)
├── auth.service.ts        # Service: logika bisnis utama                 (≤300 LOC)
├── auth.repository.ts     # Repository: query database via Drizzle       (≤200 LOC)
├── auth.schema.ts         # Schema: validasi input Zod                   (≤100 LOC)
├── auth.types.ts          # Types: interface & type khusus modul ini     (≤100 LOC)
├── auth.route.test.ts     # Integration test untuk routes
└── auth.service.test.ts   # Unit test untuk service
```

**Tanggung jawab per layer:**

| Layer        | Boleh                                        | Tidak Boleh                            |
|--------------|----------------------------------------------|----------------------------------------|
| Route        | Validasi input, panggil service, return response | Logika bisnis, query database langsung |
| Service      | Logika bisnis, orkestrasi repository, validasi domain | Akses HTTP request/response langsung   |
| Repository   | Query database, mapping data                 | Logika bisnis, validasi input          |

### 2. Frontend — Komponen Atomik

Jika file komponen mencapai >200 baris, pecah secara atomik:

```
apps/web/src/features/chat/
├── ChatPage.tsx               # Page: komposisi komponen         (≤250 LOC)
├── components/
│   ├── ChatBubble.tsx         # Komponen UI pesan                (≤200 LOC)
│   ├── ChatInput.tsx          # Komponen input + kirim           (≤150 LOC)
│   ├── IcebreakerPills.tsx    # Tombol pill icebreaker           (≤100 LOC)
│   └── EncryptionBadge.tsx    # Badge status E2EE                (≤50 LOC)
├── hooks/
│   ├── use-chat-messages.ts   # Hook: fetch & cache pesan        (≤100 LOC)
│   └── use-encryption.ts      # Hook: logika E2EE                (≤100 LOC)
└── types/
    └── chat.types.ts          # Type definitions                  (≤100 LOC)
```

**Aturan pemecahan frontend:**

- Pisahkan **UI rendering** dari **data fetching** (gunakan custom hooks).
- Pisahkan **state management** dari **presentasi** (hooks vs komponen).
- Elemen UI yang berulang (tombol, kartu, input) masuk ke `packages/ui` atau folder `components/`.

### 3. Packages — Shared Code

Pindahkan kode yang digunakan oleh lebih dari satu workspace ke `packages/`:

```
packages/
├── shared/
│   ├── src/
│   │   ├── validators/         # Skema validasi Zod
│   │   │   ├── user.schema.ts
│   │   │   └── session.schema.ts
│   │   ├── types/              # Interface & type bersama
│   │   │   ├── user.types.ts
│   │   │   └── api-response.types.ts
│   │   ├── utils/              # Helper functions
│   │   │   ├── crypto.utils.ts
│   │   │   └── date.utils.ts
│   │   └── index.ts            # Public API (barrel export)
│   └── package.json
├── db/
│   ├── src/
│   │   ├── schema/             # Drizzle schema per tabel
│   │   │   ├── users.ts
│   │   │   ├── sessions.ts
│   │   │   └── messages.ts
│   │   ├── migrations/
│   │   └── index.ts
│   └── package.json
└── ui/                          # (Opsional) Shadcn komponen bersama
    ├── src/
    │   ├── Button.tsx
    │   ├── Dialog.tsx
    │   └── index.ts
    └── package.json
```

## Pedoman untuk AI Code Generation

Saat menghasilkan kode, AI **WAJIB** mengikuti aturan berikut:

1. **Jangan pernah** menghasilkan satu file >300 baris untuk backend atau >200 baris untuk frontend.
2. **Selalu** pecah output menjadi beberapa file sesuai struktur layered di atas.
3. **Selalu** tentukan di file mana setiap potongan kode harus ditempatkan (path lengkap).
4. **Selalu** sertakan barrel export (`index.ts`) jika membuat modul baru.
5. **Jika diminta membuat fitur besar**, hasilkan output bertahap per layer/komponen, bukan sekaligus.

## Tanda-Tanda File Harus Dipecah

- ⚠️ File melebihi batas LOC ideal.
- ⚠️ File memiliki lebih dari 3 fungsi/method publik.
- ⚠️ File mengimpor dari lebih dari 5 modul eksternal yang berbeda.
- ⚠️ File menangani lebih dari 1 concern (misal: validasi + bisnis logik + query DB).
- ⚠️ Nama file terlalu generik (misal: `utils.ts`, `helpers.ts`, `index.ts` yang berisi logika).

## Larangan

- ❌ **DILARANG** menghasilkan file >500 baris tanpa alasan yang terdokumentasi.
- ❌ **DILARANG** mencampur route handler dengan business logic dalam satu file.
- ❌ **DILARANG** mencampur data fetching dengan UI rendering dalam satu komponen React.
- ❌ **DILARANG** menaruh semua tipe data di satu file `types.ts` raksasa — pecah per domain/modul.
- ❌ **DILARANG** menggunakan barrel export (`index.ts`) yang mengekspor ulang >20 item — pecah per sub-modul.
