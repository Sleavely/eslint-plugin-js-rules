# @sleavely/eslint-plugin-js-rules

Opinionated rules for maintainable projects.

Typescript-specific rules is a separate plugin; [`@sleavely/eslint-plugin-ts-rules`](https://github.com/Sleavely/eslint-plugin-ts-rules)

## Installing

```sh
npm i --save-dev @sleavely/eslint-plugin-js-rules
```

```js
// .eslintrc.cjs
module.exports = {
  // ..
  plugins: [
    '@sleavely/js-rules',
  ],
  rules: {
    '@sleavely/js-rules/destructure-env': ['error', 'always'],
    '@sleavely/js-rules/uppercase-env': ['error', 'always'],
  }
}
```

## Rules

### js-rules/destructure-env

Environment variables that affect how the application runs should be easy to find.

Setting default values that are strings will ensure that you never have to deal with "possibly undefined" cases.

```js
// ✅ Destructured and have default string values
const {
  ENVIRONMENT = 'dev',
  POTATO = '',
} = process.env
console.log(POTATO)

// ❌ Needs destructuring
console.log(process.env.POTATO)

// ❌ Needs destructuring
const { env } = process
console.log(env.POTATO)

// ❌ Needs destructuring
const { env: renamedEnv } = process
console.log(env.POTATO)

// ❌ Needs destructuring
const env = process.env
console.log(env.POTATO)

// ❌ Needs a default string value
const { POTATO } = process.env
console.log(POTATO)
```

```js
// ✅
import foo from 'foo'
const {
  ENV_VAR = ''
} = process.env
export const foobar = () => foo()

// ❌ Only import/require may appear prior to process.env
import foo from 'foo'
export const foobar = () => foo()
const {
  ENV_VAR = ''
} = process.env

// ❌ process.env must be destructured in root scope
export const logEnv () => {
  const {
    ENV_VAR = ''
  } = process.env
  console.log(ENV_VAR)
}
```

### js-rules/uppercase-env

Environment variables are constants throughout your applications lifecycle. Uppercasing environment variables helps distinguish them from other identifiers.

```js
// ✅
const {
  POTATO = ""
} = process.env

// ✅
console.log(process.env.POTATO)

// ❌
const {
  potato = ""
} = process.env

// ❌
console.log(process.env.potato)
```
