import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Desativa regras do ESLint que conflitam com o Prettier.
  prettier,
  // Sobrescreve os ignores padrão do eslint-config-next.
  globalIgnores([
    // Ignores padrão do eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
