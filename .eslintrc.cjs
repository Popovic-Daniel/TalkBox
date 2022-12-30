module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:react/recommended', 'standard-with-typescript', 'plugin:react/jsx-runtime'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['react'],
	rules: {
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/semi': 'off',
		'@typescript-eslint/space-before-function-paren': 'off',
		'no-tabs': 'off',
		'@typescript-eslint/comma-dangle': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/triple-slash-reference': 'off',
	},
};
