import { createCardEslintConfig } from '@homeassistant-extras/config/eslint/card';

export default createCardEslintConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['.ncurc.cjs'],
  // this card keeps its Lit components at the top of src/
  cardFiles: ['src/card.ts', 'src/editor.ts', 'src/index.ts'],
});
