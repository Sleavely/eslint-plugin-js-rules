import { RuleTester } from '@typescript-eslint/rule-tester';

import destructureEnv from './destructure-env';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser'
});

ruleTester.run('detructure-env', destructureEnv, {
  valid: [
    `const { potato = "", } = process.env; console.log(potato)`,
  ],
  invalid: [
    {
      code: 'console.log(process.env.potato)',
      errors: [{ messageId: 'needsDestructuring' }],
    },
    {
      code: `const { env } = process
             console.log(env.potato)`,
      errors: [{ messageId: 'needsDestructuring' }],
    },
    {
      code: `const { env: renamedEnv } = process
             console.log(env.potato)`,
      errors: [{ messageId: 'needsDestructuring' }],
    },
    {
      code: `const env = process.env
             console.log(env.potato)`,
      errors: [{ messageId: 'needsDestructuring' }],
    },
    {
      code: 'const { potato } = process.env; console.log(potato)',
      errors: [{ messageId: 'needsStringDefault' }],
    },
  ],
});
