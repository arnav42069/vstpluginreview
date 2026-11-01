import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".output/**",
      ".tanstack/**",
      ".vercel/**",
      "src/generated/**",
      "src/routeTree.gen.ts",
    ],
  },
  ...tseslint.configs.recommended,
);
