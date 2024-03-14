import type { TSESLint } from '@typescript-eslint/utils';

import markKeystoneAsUsed from './keystone-used-rule.js';


export const rules = {
	'mark-as-used': markKeystoneAsUsed,
} satisfies Record<string, TSESLint.RuleModule<string, unknown[]>>;
