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
            { file: outputDir + pkg.module, format: 'es' },
            { file: outputDir + pkg.main, name: pkg.name, format: 'umd' },
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
            { file: outputDir + pkg.main, name: pkg.name, format: 'umd' },
        ]
    }
];
