export type LocaleCode = "en" | "vi";
export declare function setDefaultLocale(locale: LocaleCode): void;
export declare function getAvailableLocales(): LocaleCode[];
export interface TranslateOptions {
    locale?: LocaleCode;
}
export declare function t(key: string, vars?: Record<string, string | number>, options?: TranslateOptions): string;
export declare function tWithLocale(locale: LocaleCode, key: string, vars?: Record<string, string | number>): string;
