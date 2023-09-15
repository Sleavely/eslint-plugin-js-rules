import { TSESLint } from '@typescript-eslint/utils';
import destructureEnv from './destructure-env';

export const rules = {
  'destructure-env': destructureEnv,
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;
