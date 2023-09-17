import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from './destructure-env';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser'
});

ruleTester.run('detructure-env', rule, {
  valid: [
    `const { potato = "", } = process.env;
         console.log(potato)`,

    // ignores interactions with other props
    `console.log(process.argv)`,

    // allows import statements prior
    `import foo from 'foo';
         const { bar = "" } = process.env`,
  ],
  invalid: [
    {
      code: 'console.log(process.env.potato)',
      errors: [{ messageId: 'needsDestructuring' }],
    },
    {
      code: `const potato = process.env.potato;
         console.log(potato)`,
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
      code: `const { potato } = process.env;
         console.log(potato)`,
      errors: [{ messageId: 'needsStringDefault' }],
    },
    {
      code: `import foo from 'foo';
         console.log(foo);
         const { potato = "" } = process.env;
         console.log(potato)`,
      errors: [{ messageId: 'onlyImportsAllowedBefore' }],
    },
    {
      code: `function getEnv() {
           const { potato } = process.env;
           return potato;
         }`,
      errors: [{ messageId: 'placeInRootScope' }, { messageId: 'needsStringDefault' }],
    },
  ],
});
