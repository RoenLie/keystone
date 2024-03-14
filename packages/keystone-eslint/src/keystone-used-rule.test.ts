import { RuleTester } from '@typescript-eslint/rule-tester';

import markKeystoneAsUsed from './keystone-used-rule.js';


const ruleTester = new RuleTester({
	parser: '@typescript-eslint/parser',
});

ruleTester.run('mark-as-used', markKeystoneAsUsed, {
	valid: [
		'const Cmp = create();'
		+ 'html`<Cmp></Cmp><Cmp/>`',
	],
	invalid: [],
});
