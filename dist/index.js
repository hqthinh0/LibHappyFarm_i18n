"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultLocale = setDefaultLocale;
exports.getAvailableLocales = getAvailableLocales;
exports.t = t;
exports.tWithLocale = tWithLocale;
const en_json_1 = __importDefault(require("./locales/en.json"));
const vi_json_1 = __importDefault(require("./locales/vi.json"));
const dictionaries = {
    en: en_json_1.default,
    vi: vi_json_1.default,
};
let defaultLocale = "en";
function setDefaultLocale(locale) {
    if (dictionaries[locale]) {
        defaultLocale = locale;
    }
    else {
        console.warn(`[i18n] Locale "${locale}" not found, keep "${defaultLocale}"`);
    }
}
function getAvailableLocales() {
    return Object.keys(dictionaries);
}
function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => {
        if (acc == null)
            return undefined;
        return acc[key];
    }, obj);
}
function applyVars(text, vars) {
    if (typeof text !== "string") {
        return String(text ?? "");
    }
    if (!vars)
        return text;
    let result = text;
    Object.keys(vars).forEach((k) => {
        const reg = new RegExp(`{{\\s*${k}\\s*}}`, "g");
        result = result.replace(reg, String(vars[k]));
    });
    return result;
}
function t(key, vars, options) {
    const locale = options?.locale ?? defaultLocale;
    const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
    const raw = getByPath(dict, key);
    if (raw == null) {
        return key;
    }
    return applyVars(raw, vars);
}
function tWithLocale(locale, key, vars) {
    const selectedLocale = dictionaries[locale]
        ? locale
        : defaultLocale;
    const dict = dictionaries[selectedLocale];
    const raw = getByPath(dict, key);
    if (raw == null) {
        return key;
    }
    return applyVars(raw, vars);
}
//# sourceMappingURL=index.js.map