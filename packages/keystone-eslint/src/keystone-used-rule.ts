import type { TSESLint } from '@typescript-eslint/utils';


const keystoneExpr = /<([A-Z]\w+)/g;


const markKeystoneAsUsed: TSESLint.RuleModule<string> = {
	defaultOptions: [],
	meta:           {
		type:     'suggestion',
		messages: {},
		fixable:  undefined,
		schema:   [], // no options
	},
	create(context) {
		return {
			TaggedTemplateExpression(node) {
				for (const quasi of node.quasi.quasis) {
					const tags = quasi.value.raw.matchAll(keystoneExpr);
					for (const [ , tag ] of tags) {
						if (!tag)
							continue;

						context.sourceCode.markVariableAsUsed(tag, node);
					}
				}
			},
		};
	},
};

export default markKeystoneAsUsed;
