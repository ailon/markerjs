import pkg from './package.json';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import svgo from 'rollup-plugin-svgo';
import generatePackageJson from 'rollup-plugin-generate-package-json'

const outputDir = "./dist/";

let leanPkg = Object.assign({}, pkg);
leanPkg.scripts = {};
leanPkg.devDependencies = {};

const banner = `/* **********************************
marker.js version ${pkg.version}
https://markerjs.com

copyright Alan Mendelevich
see README.md and LICENSE for details
********************************** */`;

export default [
    {
        input: 'src/index.ts',
        plugins: [
            del({ targets: 'dist/*' }),
            typescript({
                clean: true,
                useTsconfigDeclarationDir: true,
            }),
            postcss(),
            svgo(),
            generatePackageJson({
                baseContents: leanPkg
            })],
        output: [
            {
                file: outputDir + pkg.module,
                format: 'es',
                banner: banner,
            },
            {
                file: outputDir + pkg.main,
                name: pkg.name,
                format: 'umd',
                sourcemap: true,
                banner: banner,
            },
        ]
    },
    // workaround for terser plugin bug with multiple outputs
    // https://github.com/TrySound/rollup-plugin-terser/issues/5
    {
        input: 'src/index.ts',
        plugins: [
            typescript({
                clean: true,
                useTsconfigDeclarationDir: true,
            }),
            postcss(),
            svgo(),
            generatePackageJson({
                baseContents: leanPkg
            })],
        output: [
            { 
                file: outputDir + pkg.main, 
                name: pkg.name, 
                format: 'umd',
                banner: banner
            },
        ]
    }
];
