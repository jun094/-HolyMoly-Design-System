export default [
	buildJS(input, pkg.main, 'cjs'),
	buildJS(input, 'dist/esm', 'es'),
  ];
  
  function buildJS(input, output, format) {
	const defaultOutputConfig = {
	  format, exports: 'named', sourcemap: true,
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
		external: ['react'],
		output: [
		  format === 'es' ? esOutputConfig : cjsOutputConfig,
		],
		plugins: [
		  peerDepsExternal(),
		  commonjs(),
		  resolve({
			preferBuiltins: false,
			extensions,
		  }),
		  babel({
			presets: [
			  '@babel/env',
			  '@babel/preset-typescript',
			],
			plugins: [
			  '@babel/plugin-transform-runtime',
			],
			babelHelpers: 'runtime',
			exclude: excludePath,
			extensions,
		  }),
		],
		preserveModules: format === 'es',
	  };

	return config;
}
