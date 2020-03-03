import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const packageInfo = require('./package.json');

const isDevelop = process.env.NODE_ENV === 'development';

const output = [
  {
    file: isDevelop ? './lib/index.dev.js' : './lib/index.js',
    format: 'cjs',
  },
];

if (!isDevelop) {
  output.push({
    file: './lib/index.es.js',
    format: 'es',
  });
  output.push({
    file: './lib/index.umd.js',
    name: 'ReactStores',
    format: 'umd',
    globals: {
      react: 'React',
    },
  });
}

export default [
  {
    input: ['./src/index.ts'],
    output: output,
    external: ['react'],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
          },
          sourceMap: isDevelop,
          include: ['./src/*.ts'],
        },
      }),
      replace({
        __VERSION__: JSON.stringify(packageInfo.version),
        __IS_DEV__: JSON.stringify(isDevelop),
      }),
      !isDevelop && terser(),
    ],
  },
];
