import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-cpy';

import commoncfg from './rollup.config.common';


commoncfg[0].plugins.push(
    terser(),
    copy({
        files: ['LICENSE', 'README.md'],
        dest: 'dist'
    }),
    );
// workaround for terser plugin bug with multiple outputs
// https://github.com/TrySound/rollup-plugin-terser/issues/5
commoncfg[0].output.pop();
commoncfg[1].plugins.push(
    terser(),
);

export default commoncfg;
