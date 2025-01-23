import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import * as pluginCheckFile from 'eslint-plugin-check-file'
import pluginImport from 'eslint-plugin-import'
import pluginIsaacscript from 'eslint-plugin-isaacscript'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginPromise from 'eslint-plugin-promise'
import pluginVitest from 'eslint-plugin-vitest'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const tsParserOptions = {
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      // ecmaVersion: 'latest', // default
      // sourceType: 'module', // default
      tsconfigRootDir: __dirname,
      project: true,
    },
  },
}

export default [
  // files that we don't want to lint
  {
    ignores: ['**/generated-types.ts', '.sst/*'],
  },
  // recommended eslint rules
  js.configs.recommended,
  // typescript recommended and strict rules
  ...compat.extends('plugin:@typescript-eslint/strict-type-checked'),
  // promise based rules
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      promise: pluginPromise,
    },
    rules: {
      // recommended rules
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
    },
  },
  // prettier integration and recommended rules
  pluginPrettier,
  // vitest rules
  {
    files: ['**/*.test.{js,ts}'],
    ...tsParserOptions,
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      // recommended rules
      'vitest/expect-expect': 'error',
      'vitest/no-commented-out-tests': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/no-import-node-test': 'error',
      'vitest/require-local-test-context-for-concurrent-snapshots': 'error',
      'vitest/valid-describe-callback': 'error',
      'vitest/valid-expect': 'error',
      'vitest/valid-title': 'error',
      // other useful rules
      'vitest/consistent-test-it': 'error',
      'vitest/require-top-level-describe': 'error',
      'vitest/prefer-called-with': 'warn',
      'vitest/prefer-each': 'warn',
      'vitest/prefer-to-be-falsy': 'warn',
      'vitest/prefer-to-be-truthy': 'warn',
      'vitest/prefer-to-contain': 'warn',
      'vitest/prefer-to-have-length': 'warn',
      'vitest/prefer-todo': 'warn',
    },
  },
  // import rules
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    ...tsParserOptions,
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/export': 'error',
      'import/first': 'error',
      // 'import/namespace': 'error', // needs parser changes
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['eslint.config.js', '**/*.test.{js,ts}', 'backend/core/test/*.{js,ts}'],
          optionalDependencies: ['**/*.test.{js,ts}'],
          packageDir: [__dirname, path.join(__dirname, '../../../')],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      'import/internal-regex': '^sst/',
    },
  },
  // file naming rules
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      'check-file': pluginCheckFile,
    },
    rules: {
      // file and folder names
      'check-file/filename-naming-convention': [
        'warn',
        {
          '**/!(*.d|*.test).{js,ts}': 'KEBAB_CASE',
          '**/*.test.{js,ts}': '[a-z]*(-[a-z0-9]+)*.test',
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'backend/*/': 'KEBAB_CASE',
        },
      ],
    },
  },
  // jsdoc rules and misc rules overrides
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      isaacscript: pluginIsaacscript,
    },
    rules: {
      // typscript fixes/overrides
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],

      // These rules are only disabled because we hit a bug in linting.
      // See https://github.com/t3-oss/create-t3-app/pull/1036#discussion_r1060505136
      // If you still see the bug once TypeScript@5 is used, please let typescript-eslint know!
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',

      // For educational purposes we format our comments/jsdoc nicely
      'isaacscript/complete-sentences-jsdoc': 'warn',
      'isaacscript/format-jsdoc-comments': 'warn',
    },
  },
  // overrides for eslint config
  {
    files: ['eslint.config.js'],
    rules: {
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-naming-convention': 'off',
    },
  },
]
