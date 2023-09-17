import { TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'needsDestructuring' | 'needsStringDefault' | 'placeInRootScope' | 'onlyImportsAllowedBefore';
const defaultOptions = ['always', { forceStringDefault: true }]
const destructureEnv: TSESLint.RuleModule<MessageIds, typeof defaultOptions> = {
  defaultOptions,
  meta: {
    type: 'suggestion',
    messages: {
      needsDestructuring: 'Environment variables should always be destructured from process.env to give other developers a quick overview of how they can affect the behavior in their environment.',
      needsStringDefault: 'Define a default string here to avoid dealing with possibly undefined values. This option is especially useful in typed projects where having handling possibly-undefined values can cause a lot of unnecessary code to handle them.',
      placeInRootScope: 'Place environment variables at the top of the file to give other developers a quick overview of how they can affect the behavior in their environment.',
      onlyImportsAllowedBefore: 'Only import and require() statements are allowed to appear before declaring environment variables.'
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
    "VariableDeclaration:exit": (variableDeclaration) => {
      for (const variableDeclarator of variableDeclaration.declarations) {
        if (variableDeclarator.type !== 'VariableDeclarator') return;
        if (!variableDeclarator.init) return;
        if (variableDeclarator.init.type !== 'MemberExpression') return;

        if (variableDeclarator.init.object.type !== 'Identifier') return;
        if (variableDeclarator.init.object.name !== 'process') return;
        if (variableDeclarator.init.property.type !== 'Identifier') return;
        if (variableDeclarator.init.property.name !== 'env') return;

        if (variableDeclaration.parent.type === 'Program') {
          // check that the preceeding sibling nodes or `variableDeclaration` are only import/require statements?
          const indexOfDeclaration = variableDeclaration.parent.body.findIndex((node) => node === variableDeclaration)
          const hasOtherNodesBefore = variableDeclaration.parent.body.some((node, i) => {
            if (i >= indexOfDeclaration) return false
            if (node.type === 'ImportDeclaration') return false
            if (node.type !== 'VariableDeclaration') return true
            const onlyUsesRequire = node.declarations.every((declaration) => {
              if (!declaration.init) return false
              if (declaration.init.type !== 'CallExpression') return false
              if (declaration.init.callee.type !== 'Identifier') return false
              if (declaration.init.callee.name !== 'require') return false
              return true
            })
            if (!onlyUsesRequire) return true
            return false
          })
          if (hasOtherNodesBefore) {
            context.report({
              node: variableDeclaration,
              messageId: 'onlyImportsAllowedBefore'
            })
          }
        } else {
          context.report({
            node: variableDeclaration,
            messageId: 'placeInRootScope'
          })
        }
      }
    },
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
            if (destructuredProperty.type !== 'Property') return;
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
