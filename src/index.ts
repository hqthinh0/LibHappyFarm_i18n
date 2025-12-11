import en from "./locales/en.json";
import vi from "./locales/vi.json";

export type LocaleCode = "en" | "vi";

type LocaleDictionary = Record<string, any>;

const dictionaries: Record<LocaleCode, LocaleDictionary> = {
  en,
  vi,
};

let defaultLocale: LocaleCode = "en";

export function setDefaultLocale(locale: LocaleCode): void {
  if (dictionaries[locale]) {
    defaultLocale = locale;
  } else {
    console.warn(`[i18n] Locale "${locale}" not found, keep "${defaultLocale}"`);
  }
}

export function getAvailableLocales(): LocaleCode[] {
  return Object.keys(dictionaries) as LocaleCode[];
}

function getByPath(obj: LocaleDictionary, path: string): any {
  return path.split(".").reduce((acc: any, key: string) => {
    if (acc == null) return undefined;
    return acc[key];
  }, obj);
}

function applyVars(
  text: unknown,
  vars?: Record<string, string | number>
): string {
  if (typeof text !== "string") {
    return String(text ?? "");
  }

  if (!vars) return text;

  let result = text;
  Object.keys(vars).forEach((k) => {
    const reg = new RegExp(`{{\\s*${k}\\s*}}`, "g");
    result = result.replace(reg, String(vars[k]));
  });

  return result;
}

export interface TranslateOptions {
  locale?: LocaleCode;
}

export function t(
  key: string,
  vars?: Record<string, string | number>,
  options?: TranslateOptions
): string {
  const locale: LocaleCode = options?.locale ?? defaultLocale;
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];

  const raw = getByPath(dict, key);

  if (raw == null) {
    return key;
  }

  return applyVars(raw, vars);
}

export function tWithLocale(
  locale: LocaleCode,
  key: string,
  vars?: Record<string, string | number>
): string {
  const selectedLocale: LocaleCode = dictionaries[locale]
    ? locale
    : defaultLocale;

  const dict = dictionaries[selectedLocale];
  const raw = getByPath(dict, key);

  if (raw == null) {
    return key;
  }

  return applyVars(raw, vars);
}
