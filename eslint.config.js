import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', {
        'js': 'never',
        'jsx': 'never', 
        'ts': 'never',
        'tsx': 'never'
      }],
      'import/no-unresolved': 'off',
      'import/named': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_', 
        'varsIgnorePattern': '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': ['error', {}, { 'usePrettierrc': true }]
    },
    settings: {
      'import/resolver': {
        typescript: {}, 
        node: {}
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx']
    },
  }
);