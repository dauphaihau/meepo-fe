module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@stylistic',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Spacing
    '@stylistic/func-call-spacing': 'error',
    '@stylistic/space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/type-generic-spacing': 'error',
    // '@stylistic/type-named-tuple-spacing ': 'error',

    // Semi
    '@stylistic/semi': ['error', 'always',
      {
        omitLastInOneLineBlock: true,
        omitLastInOneLineClassBody: true,
      },
    ],

    // Indent
    '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],

    // Commas
    '@stylistic/comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],

    // Line breaks
    '@stylistic/object-curly-newline': ['error', {
      multiline: true,
      minProperties: 4,
      consistent: true,
    }],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],

    // Quotes
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/quote-props': ['error', 'as-needed'],

    // Brackets
    '@stylistic/new-parens': 'error',
    '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],

    // Operators
    '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/no-mixed-operators': 'error',
    '@stylistic/operator-linebreak': ['error', 'after'],
    '@stylistic/dot-location': ['error', 'property'],

    // Disallow
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-tabs': 'off',

    // Misc
    '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],

    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/max-len': ['error',
      {
        code: 120,
        template: 110,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreHTMLAttributeValues: true,
      },
    ],

    // Others
    // camelcase: 'off',
    'no-undef': 'off', // tsconfig noUnusedLocals handle this
  },

};
