import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // .agents/skills and supabase/functions are vendor/third-party or a
    // separate runtime (Deno) -- not this project's own code.
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "brand/**", ".agents/skills/**", "supabase/functions/**"],
  },
];

export default eslintConfig;
