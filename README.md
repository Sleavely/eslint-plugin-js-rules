# @sleavely/eslint-plugin-js-rules

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

```js
// ✅ Destructured and has a default string value
const { potato = "" } = process.env
console.log(potato)

// ❌ Needs destructuring
console.log(process.env.potato)

// ❌ Needs destructuring
const { env } = process
console.log(env.potato)

// ❌ Needs destructuring
const { env: renamedEnv } = process
console.log(env.potato)

// ❌ Needs destructuring
const env = process.env
console.log(env.potato)

// ❌ Needs a default string value
const { potato } = process.env
console.log(potato)
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
