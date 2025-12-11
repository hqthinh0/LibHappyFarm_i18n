# @tnet-i18n/i18n

> Shared **i18n package** cho hệ thống web & mobile apps của dự án HappyFarm Game cho các ngôn ngữ.  
> Dùng để đồng bộ key/value translations (multi-language) và cung cấp API/React hook để thao tác thuận tiện.

---

## ✨ Tính năng

- 📦 **Centralized translations**: dùng chung `locales/*.json` cho cả web (React) và app (React Native).
- 🔑 **Type-safe keys**: auto-generate type từ `en.json` → autocomplete khi gọi `t()`.
- ⚡ **React hooks**: có sẵn `useT()` để dễ dùng trong component.
- 🔄 **Hot language switch**: hỗ trợ `i18next.changeLanguage()` runtime.
- 🚀 **CI/CD ready**: publish tự động qua GitHub Actions khi release.

---

## 📥 Cài đặt

Package được publish public trên npm:

```bash
yarn add @happyfarm-i18n/i18n
# hoặc npm
npm install @happyfarm-i18n/i18n
```

---

## 🛠 Cách dùng

### 1. Khởi tạo i18n

Trong **entry file** của app (ví dụ `main.tsx` với Reactjs, `App.tsx` với React Native):

```ts

import { t, setDefaultLocale } from "happyfarm-i18n";


// Khởi tạo với ngôn ngữ mặc định
initI18n({ lng: "en" });
```

### 2. Dùng hàm `t()`

```tsx
import { t } from "@happyfarm-i18n/i18n";

function Example() {
  return <h1>{t("button.viewQuotes")}</h1>;
}
```

### 3. Dùng hook `useT()`

```tsx
import { useT } from "@happyfarm-i18n/i18n";

export function Example() {
  const { t, i18n, lng } = useT();

  return (
    <>
      <p>Current language: {lng}</p>
      <p>{t("common.loading")}</p>
      <button onClick={() => i18n.changeLanguage(lng === "en" ? "cn" : "en")}>
        Switch Language
      </button>
    </>
  );
}
```

---

## 🌍 Cấu trúc `locales/`

```txt
locales/
 ├─ en.json   # English
 └─ vi.json   # VietNamese
```

Ví dụ `en.json`:

```json
{
  "button": {
    "login": "Login",
    "logout": "Logout",
    "viewQuotes": "View Quotes"
  },
  "common": {
    "loading": "Loading..."
  }
}
```
---

## 🔑 Type-safe Keys

Sau mỗi lần build, file `dist/keys.d.ts` sẽ được sinh tự động từ `en.json`.

```ts
import { t } from "@tnet-i18n/i18n";
import type { TranslationKey } from "@tnet-i18n/i18n/dist/keys";

function safeT<K extends TranslationKey>(key: K) {
  return t(key);
}

safeT("button.login");     // ✅
safeT("button.notExists"); // ❌ lỗi compile
```

---

## 🚀 Release quy trình

### 1. Tự động (qua GitHub Actions)
- Bump version trong `package.json` (ví dụ `"1.0.1"`).
- Commit & tạo tag theo format:
  ```bash
  git commit -am "chore(release): v1.0.1"
  git tag i18n-v1.0.1
  git push origin main --tags
  ```
- GitHub Actions sẽ tự build & publish lên npm.

### 2. Thủ công (Run workflow)
- Push code với version mới trong `package.json`.
- Vào tab **Actions → Publish to npm → Run workflow**.
- CI sẽ build & publish version mới.

---

## 📦 Scripts có sẵn

- `yarn build` – build TypeScript → `dist/`
- `yarn check:placeholders` – check placeholders giữa các file locale
- `yarn gen:keys` – generate type keys từ `en.json`
- `yarn prepublishOnly` – chạy full build + check + gen trước khi publish

---

## 📜 License

MIT © [Huynh Thinh HappyFarm](......)