// eslint.config.js
import js from '@eslint/js'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vuePlugin from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  // Vue 文件解析配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          ts: tsParser,
          project: './tsconfig.eslint.json',
        },
      },
    },
  },
  // TypeScript 文件配置
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
  // 插件规则配置
  {
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 0,
      'no-undef': 2,
      'prettier/prettier': 'off',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
    },
  },
  // 忽略配置
  {
    ignores: ['dist/**', '**/*.d.ts'],
  },
]
