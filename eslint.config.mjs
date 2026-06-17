export default [
	{
		files: ["*.js"],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "script",
			globals: {
				Module: "readonly",
				Log: "readonly",
				document: "readonly",
				setInterval: "readonly",
				console: "readonly",
				require: "readonly",
				module: "readonly"
			}
		},
		rules: {}
	}
];
