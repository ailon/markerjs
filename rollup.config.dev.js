import commoncfg from './rollup.config.common';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-cpy';
import staticSite from 'rollup-plugin-static-site';

commoncfg[0].plugins.push(
    staticSite({
        template: { path: 'src/dev-assets/template.html' },
        dir: 'dist'
    }),
    copy({
        files: ['src/dev-assets/*.jpg'],
        dest: 'dist'
    }),
    serve('dist'),
    livereload()
);
// only generate UMD during dev
commoncfg[0].output.splice(0, 1);
// workaround for terser plugin bug with multiple outputs
// https://github.com/TrySound/rollup-plugin-terser/issues/5
// don't need double inputs in dev
commoncfg.pop();

export default commoncfg;