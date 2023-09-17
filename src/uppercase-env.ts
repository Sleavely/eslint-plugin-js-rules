import { TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'needsCapitalizing' | 'noComputed';
const defaultOptions = ['always']
const destructureEnv: TSESLint.RuleModule<MessageIds, typeof defaultOptions> = {
  defaultOptions,
  meta: {
    type: 'suggestion',
    messages: {
      needsCapitalizing: 'Renaming this variable to UPPER_CONST format to better distinguish it from other constants.',
      noComputed: 'Environment variables must not use computed names.',
    },
    fixable: 'code', // TODO: implement fixers
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      }
    ],
  },
  create: context => ({

    'MemberExpression[object.name="process"][property.name="env"]:exit': (node: TSESTree.MemberExpression) => {
      if (node.parent.type === 'MemberExpression') {
        if (node.parent.property.type === 'Identifier') {
          if (!node.parent.property.name.match(/^[A-Z0-9_]+$/)) {
            context.report({
              node: node.parent.property,
              messageId: 'needsCapitalizing'
            })
          }
        }
      }
      if (node.parent.type !== 'VariableDeclarator') return;
      if (node.parent.id.type !== 'ObjectPattern') return;

      for (const destructuredProperty of node.parent.id.properties) {
        if (destructuredProperty.type !== 'Property') return;
        if (destructuredProperty.value.type !== 'AssignmentPattern') return;

        if (destructuredProperty.computed) {
          context.report({
            node: destructuredProperty,
            messageId: 'noComputed'
          })
          return;
        }

        if (destructuredProperty.key.type !== 'Identifier') return;
        if (!destructuredProperty.key.name.match(/^[A-Z0-9_]+$/)) {
          context.report({
            node: destructuredProperty,
            messageId: 'needsCapitalizing'
          })
        }

      }
    },
  })
}

export default destructureEnv
