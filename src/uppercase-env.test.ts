import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from './uppercase-env';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser'
});

ruleTester.run('uppercase-env', rule, {
  valid: [
    `const { POTATO = "", } = process.env`,

    `console.log(process.env.POTATO)`,
  ],
  invalid: [
    {
      code: 'console.log(process.env.potato)',
      errors: [{ messageId: 'needsCapitalizing' }],
    },
    {
      code: `const { potato = "", } = process.env`,
      errors: [{ messageId: 'needsCapitalizing' }],
    },
    {
      code: `const potato = process.env.potato`,
      errors: [{ messageId: 'needsCapitalizing' }],
    },
  ],
});
