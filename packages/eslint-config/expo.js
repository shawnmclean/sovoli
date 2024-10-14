

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['src/app/**/{index,_layout}.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  }
];
