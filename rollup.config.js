import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        preserveModules: true,
        input: './src/index.tsx',
        output: [
            {
                dir: './lib',
                format: 'esm',
            },
        ],
        external: [...Object.keys(pkg.dependencies || {})],
        plugins: [
            peerDepsExternal(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
            }),
            typescript({
                typescript: require('typescript'),
            }),
            postcss({
                plugins: [autoprefixer()],
                sourceMap: true,
                extract: true,
                minimize: true,
            }),
            resolve(),
            commonjs(),
            terser(),
        ],
    },
];
