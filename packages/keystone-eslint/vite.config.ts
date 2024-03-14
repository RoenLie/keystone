import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		setupFiles: [ './vitest.setup.ts' ],
	},
	build: {
		outDir: './dist',
		lib:    {
			fileName: () => 'index.js',
			entry:    './src/index.ts',
			formats:  [ 'cjs' ],
		},
	},
});
