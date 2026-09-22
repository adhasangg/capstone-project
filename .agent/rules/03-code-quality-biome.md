# Aturan Kualitas Kode & Biome

## Biome sebagai Linter & Formatter

Proyek ini menggunakan **Biome** (bukan ESLint/Prettier) sebagai satu-satunya linter dan formatter.

### Instalasi

```bash
bun add -d @biomejs/biome --cwd .
```

### Konfigurasi (`biome.json` di root monorepo)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noConfusingVoidType": "error"
      },
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "level": "warn",
          "options": {
            "maxAllowedComplexity": 15
          }
        }
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error",
        "useTemplate": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  }
}
```

### Perintah Biome

```bash
# Check linting
bunx biome check .

# Fix otomatis
bunx biome check --write .

# Format saja
bunx biome format --write .
```

## Aturan Type Safety (STRICT — Tidak Ada Kompromi)

### TypeScript Strict Mode

File `tsconfig.json` di setiap workspace **WAJIB** mengaktifkan:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Larangan Tipe Data

| Tipe Data  | Status       | Alasan                                                  |
|------------|--------------|--------------------------------------------------------|
| `any`      | ❌ DILARANG   | Menghilangkan semua type safety, membuat bug sulit dilacak |
| `unknown`  | ❌ DILARANG   | Harus di-narrow sebelum digunakan, gunakan tipe spesifik  |
| `object`   | ❌ DILARANG   | Terlalu generik, gunakan interface/type yang spesifik     |
| `Function` | ❌ DILARANG   | Gunakan signature fungsi yang eksplisit                   |

### Cara Mengganti `any` / `unknown`

```typescript
// ❌ SALAH — menggunakan any
function processData(data: any): any {
  return data.name;
}

// ✅ BENAR — tipe data eksplisit
interface UserData {
  name: string;
  email: string;
  role: 'student' | 'counselor';
}

function processData(data: UserData): string {
  return data.name;
}
```

```typescript
// ❌ SALAH — menggunakan unknown
function handleResponse(res: unknown): void {
  // ...
}

// ✅ BENAR — gunakan generic atau tipe spesifik
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

function handleResponse<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    throw new Error(res.error ?? 'Unknown error');
  }
  return res.data;
}
```

```typescript
// ❌ SALAH — menggunakan Function
const handler: Function = () => {};

// ✅ BENAR — signature eksplisit
type EventHandler = (event: MouseEvent) => void;
const handler: EventHandler = (event) => {
  console.log(event.target);
};
```

## Naming Conventions

| Elemen               | Konvensi           | Contoh                          |
|----------------------|--------------------|---------------------------------|
| Variable & Function  | `camelCase`        | `getUserById`, `sessionToken`   |
| Constant             | `UPPER_SNAKE_CASE` | `MAX_OTP_ATTEMPTS`, `API_BASE`  |
| Type & Interface     | `PascalCase`       | `UserProfile`, `SessionPayload` |
| Enum                 | `PascalCase`       | `UserRole`, `SessionStatus`     |
| Enum Members         | `PascalCase`       | `UserRole.Student`              |
| File (Component)     | `PascalCase`       | `ChatBubble.tsx`                |
| File (Non-Component) | `kebab-case`       | `auth.service.ts`              |
| Folder               | `kebab-case`       | `self-assessment/`              |
| Test File            | Match source file  | `ChatBubble.test.tsx`           |

## Import Organization

Urutan import (diatur otomatis oleh Biome `organizeImports`):

1. **External packages** — `react`, `elysia`, `drizzle-orm`
2. **Internal packages** — `@safespace/shared`, `@safespace/db`
3. **Relative imports** — `./components`, `../utils`
4. **Type imports** — `import type { ... }` (selalu gunakan `import type` jika hanya mengimpor tipe)

```typescript
// ✅ Urutan import yang benar
import { Elysia } from 'elysia';
import { z } from 'zod';

import { validateOtp } from '@safespace/shared';
import type { UserRole } from '@safespace/shared';

import { authService } from './services/auth.service';
import type { AuthPayload } from './types';
```

## Larangan

- ❌ **DILARANG** menggunakan `any`, `unknown`, `object`, atau `Function` sebagai tipe data.
- ❌ **DILARANG** menggunakan `// @ts-ignore` atau `// @ts-expect-error` tanpa komentar penjelasan.
- ❌ **DILARANG** meng-disable rule Biome secara inline (`// biome-ignore`) tanpa alasan terdokumentasi.
- ❌ **DILARANG** menggunakan `var` — selalu gunakan `const` atau `let`.
- ❌ **DILARANG** meninggalkan `console.log` di kode produksi (gunakan logger terstruktur).
