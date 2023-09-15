import { TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'needsDestructuring' | 'needsStringDefault';
const defaultOptions = ['always', { forceStringDefault: true }]
const destructureEnv: TSESLint.RuleModule<MessageIds, typeof defaultOptions> = {
  defaultOptions,
  meta: {
    type: 'suggestion',
    messages: {
      needsDestructuring: 'Environment variables should always be destructured from process.env, preferably at the top of the file to give other developers a quick overview of how they can affect the behavior in their environment.',
      needsStringDefault: 'Define a default string here to avoid dealing with possibly undefined values.',
    },
    fixable: 'code', // TODO: implement fixers
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
      {
          type: 'object',
          properties: {
              forceStringDefault: { type: 'boolean' }
          },
          additionalProperties: false
      },
    ], // no options
  },
  create: context => ({
    /**
     * Finds scenarios like these where a user fails to destructure
     * the specific environment variables they want to access
     *
     * const { env } = process
     * const { env: renamedEnv } = process
     */
    VariableDeclarator: (node) => {
      // Find syntax that destructures from `process`
      if (node.id.type !== 'ObjectPattern') return;
      if (!node.init) return;
      if (node.init.type !== 'Identifier') return;
      if (node.init.name !== 'process') return;

      // Iterate the properties and see if any of them read from `env`
      const readsFromEnv = node.id.properties.some((property) => {
        if (property.type !== 'Property') return false
        if (property.key.type !== 'Identifier') return false
        return property.key.name === 'env'
      })

      if (readsFromEnv) {
        context.report({
          node,
          messageId: 'needsDestructuring'
        })
      }

    },
    'MemberExpression[object.name="process"][property.name="env"]:exit': (node: TSESTree.MemberExpression) => {
      if (node.parent.type == 'VariableDeclarator') {
        if (node.parent.id.type !== 'ObjectPattern') {
          context.report({
            node,
            messageId: 'needsDestructuring'
          })
        } else {
          for (const destructuredProperty of node.parent.id.properties) {
            if (destructuredProperty.type !== 'Property') return false
            if (destructuredProperty.value.type !== 'AssignmentPattern') {
              // TODO: check for forceStringDefault
              context.report({
                node,
                messageId: 'needsStringDefault'
              })
            }
          }
        }
      } else {
        context.report({
          node,
          messageId: 'needsDestructuring'
        })
      }
    },
  })
}

export default destructureEnv
