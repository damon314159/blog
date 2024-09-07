module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:require-extensions/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
  ],
  plugins: ['unicorn', 'require-extensions', '@typescript-eslint'],
  rules: {
    'arrow-body-style': 'error',
    'prefer-arrow-callback': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', cts: 'never', mts: 'never', tsx: 'never' },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['*.config.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
        optionalDependencies: false,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'sort-imports': [
      'error',
      { allowSeparatedGroups: true, ignoreDeclarationSort: true },
    ],
    'import/no-named-as-default-member': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'unicorn/prefer-node-protocol': 'error',
    'no-param-reassign': ['error', { props: false }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off', // Disable the rule for test files
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true,
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './tsconfig.test.json',
      './packages/**/tsconfig.json',
      './apps/**/tsconfig.json',
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
    },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
}
