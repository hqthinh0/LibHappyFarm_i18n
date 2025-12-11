// scripts/check-placeholders.ts
import fs from "fs";
import path from "path";

type Dict = Record<string, any>;

function placeholders(s: string): string[] {
  const out = new Set<string>();
  for (const m of s.matchAll(/\{\{\s*([\w.]+)(?:,[^}]*)?\s*}}/g)) out.add(m[1]); // {{name}}
  for (const m of s.matchAll(/\{([\w.]+)(?:,[^}]*)?\}/g)) out.add(m[1]); // {name}
  return Array.from(out).sort();
}

function walk(obj: Dict, trail: string[] = []): Array<[string, string]> {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "string"
      ? ([[[...trail, k].join("."), v]] as Array<[string, string]>)
      : v && typeof v === "object"
      ? walk(v as Dict, [...trail, k])
      : []
  );
}

function get(obj: Dict, dotted: string): unknown {
  return dotted
    .split(".")
    .reduce((o, k) => (o as Dict | undefined)?.[k], obj as any);
}

// ---- Config & paths ----
const root = process.cwd();
const localesDir = path.join(root, "locales");
const BASE = (process.env.BASE_LOCALE || "en").trim();
const basePath = path.join(localesDir, `${BASE}.json`);

if (!fs.existsSync(basePath)) {
  console.error(`❌ Missing base file: ${basePath}`);
  process.exit(1);
}
const base = JSON.parse(fs.readFileSync(basePath, "utf8"));

// Build target list
const rawLocales = process.env.LOCALES?.trim();
let targets: Array<{ code: string; file: string }>;

if (rawLocales && rawLocales.length > 0) {
  const codes = rawLocales
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  targets = codes.map((code) => ({
    code,
    file: path.join(localesDir, `${code}.json`),
  }));
} else {
  if (!fs.existsSync(localesDir) || !fs.statSync(localesDir).isDirectory()) {
    console.error(`❌ Missing locales directory: ${localesDir}`);
    process.exit(1);
  }
  targets = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/i, ""))
    .filter((code) => code !== BASE)
    .map((code) => ({ code, file: path.join(localesDir, `${code}.json`) }));
}

const allowMissing = process.env.ALLOW_MISSING_LOCALE === "1";

let hasError = false;
const warnings: string[] = [];

for (const { code, file } of targets) {
  if (!fs.existsSync(file)) {
    const msg = `Missing ${code} file: ${file}`;
    if (allowMissing) {
      warnings.push(`⚠️  ${msg}`);
      continue;
    } else {
      console.error(`❌ ${msg}`);
      hasError = true;
      continue;
    }
  }

  const localeObj = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [key, baseVal] of walk(base)) {
    const locVal = get(localeObj, key);
    if (typeof locVal !== "string") {
      console.error(`❌ [${code}] Missing/invalid key (expect string): ${key}`);
      hasError = true;
      continue;
    }
    const a = placeholders(String(baseVal)).join(",");
    const b = placeholders(String(locVal)).join(",");
    if (a !== b) {
      console.error(
        `❌ [${code}] Placeholder mismatch at "${key}": ${BASE}(${a}) vs ${code}(${b})`
      );
      hasError = true;
    }
  }
}

for (const w of warnings) console.warn(w);

if (hasError) {
  console.error("🔎 Placeholder check failed.");
  process.exit(1);
} else {
  const list = targets.map((t) => t.code).join(", ");
  console.log(`✅ Placeholder check passed for: ${list || "(no targets)"}.`);
}
