# Internationalization / Auto-Translate

This project uses a simple runtime translation system:

- Translation files live in `lib/i18n/*.json` (e.g., `en.json`, `de.json`, `pt.json`).
- `CountryProvider` (`contexts/CountryContext.tsx`) controls the selected language via `selectedCountry.language` and persists it in localStorage and cookie `cv_locale`.
- Use `useTranslations()` (`lib/translations.ts`) to get `t(key)` for translated strings.

Auto-translate feature

- A simple auto-translate API is available at `POST /api/translate`.
- The header includes an **Auto-translate** button (globe icon) that translates any missing keys into the selected language.
- By default the server uses the public LibreTranslate instance at `https://libretranslate.de/translate`. You can override the endpoint with the environment variable `TRANSLATE_API_URL`.

Limitations & notes

- Machine translations are best-effort and not reviewed. For production, consider providing curated translations by editing `lib/i18n/*.json`.
- The public LibreTranslate instance may have rate limits. For production use a paid translation API (Google Cloud Translate, DeepL) and add support in `app/api/translate/route.ts`.
- Translated keys are merged into the runtime translations map in the client session. They are not persisted to source files on disk.

Usage

1. Open the site and open the country selector in the header to choose a country/language.
2. Click the globe button to auto-translate missing keys into the selected language.
3. If you want persistent, curated translations, add them to `lib/i18n/<lang>.json` and commit.

Currency & Locale

- Selecting a country in the header now updates both **language** and **currency** across the site.
- Prices shown in the `Pricing` page and the report purchase flow use the selected country currency and locale for formatting.
- Prices used for order creation are recorded with the selected currency so payments and records are consistent.
