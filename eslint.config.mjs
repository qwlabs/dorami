import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },
    lessOpinionated: true,
    typescript: true,
    javascript: false,
    vue: {
      overrides: {
        'vue/component-tags-order': ['error', { order: ['template', 'script', 'style'] }],
        'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
        'vue/component-name-in-template-casing': [
          'error',
          'kebab-case',
          {
            registeredComponentsOnly: true,
            ignores: [],
          },
        ],
        'vue/no-unused-refs': 'off',
        'vue/no-template-shadow': 'off',
        'vue/valid-define-emits': 'off',
        'vue/attribute-hyphenation': 'error',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/require-explicit-emits': ['error', { allowProps: true }],
        'vue/define-emits-declaration': ['error', 'type-based'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/singleline-html-element-content-newline': 'off',
      },
    },
    // unocss: true,
    jsonc: false,
    yaml: false,
    jsx: false,
  },
  {
    rules: {
      'no-console': 'off',
      'import/no-absolute-path': ['error'],
      'import/no-relative-packages': ['error'],
      'import/no-self-import': ['error'],
      'style/brace-style': ['error', '1tbs'],
      'style/comma-dangle': ['error', 'only-multiline'],
      'style/semi': ['error', 'always'],
      'style/quote-props': ['error', 'as-needed'],
      'style/arrow-parens': ['error', 'always'],
      'style/nonblock-statement-body-position': ['error', 'below'],
      'style/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
      'ts/ban-ts-comment': 'off',
      'ts/ban-ts-ignore': 'off',
      'ts/prefer-ts-expect-error': 'off',
      'ts/ban-types': 'off',
      'unused-imports/no-unused-vars': 'off',
      'ts/no-use-before-define': 'off',
    },
  }
);
