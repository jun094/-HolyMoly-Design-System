export default [
	buildJS(input, pkg.main, 'cjs'),
	buildJS(input, 'dist/esm', 'es'),
];

function buildJS(input, output, format) {
	const defaultOutputConfig = {
		format,
		exports: 'named',
		sourcemap: true,
	};

	const esOutputConfig = {
		...defaultOutputConfig,
		dir: output,
	};
	const cjsOutputConfig = {
		...defaultOutputConfig,
		file: output,
	};

	const config = {
		input,
		// 생략 - https://github.com/SoYoung210/lerna-rollup-github-package-example/blob/master/rollup.config.js
		preserveModules: format === 'es', // 하나의 파일로 bundle되지 않도록 (Tree Shaking)
	};

	return config;
}
