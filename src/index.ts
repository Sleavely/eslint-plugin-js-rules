import { TSESLint } from '@typescript-eslint/utils';
import destructureEnv from './destructure-env';
import uppercaseEnv from './uppercase-env';

export const rules = {
  'destructure-env': destructureEnv,
  'uppercase-env': uppercaseEnv,
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;
