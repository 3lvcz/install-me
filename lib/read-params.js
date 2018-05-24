const minimist = require('minimist');
const { dirname, join } = require('path');
const ensureAbsolute = require('./ensure-absolute');

const ALIASES = new Map([
    ['p', 'dependencies'],
    ['prod', 'dependencies'],
    ['d', 'devDependencies'],
    ['dev', 'devDependencies'],
    ['o', 'optionalDependencies'],
    ['optional', 'optionalDependencies'],
]);

const REG_CUSTOM = /^[a-zA-Z0-9_-]+$/;

const CWD = process.cwd();

module.exports = (processArgv = process.argv) => {
    const argv = minimist(processArgv, {
        string: ['m', 'manifest', 't', 'target'],
    });
    const manifestOrDir = ensureAbsolute(CWD, argv.m || argv.manifest || CWD);
    const manifest = manifestOrDir.endsWith('.json') ? manifestOrDir : join(manifestOrDir, 'package.json');
    const target = ensureAbsolute(CWD, argv.t || argv.target || dirname(manifest));
    const force = Boolean(argv.f || argv.force);
    const groups = new Set();
    for (const [alias, group] of ALIASES) {
        if (argv[alias]) {
            groups.add(group);
        }
    }
    for (const custom of argv._) {
        if (REG_CUSTOM.test(custom)) {
            groups.add(custom);
        }
    }
    return {
        force,
        groups: [...groups],
        manifest,
        target,
    };
};
