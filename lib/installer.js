const { exec } = require('child_process');

/**
 * @param {string} name
 * @param {string} version
 * @param {string} path
 * @param {object} [opts]
 * @param {boolean} [opts.force=false]
 */
exports.installDependency = (name, version, path, opts = {}) =>
    exports.installDependencies([[name, version]], path, opts);

/**
 * @param {(string[])[]} dependencies [[name, version], [name, version], ...]
 * @param {string} cwd
 * @param {object} [opts]
 * @param {boolean} [opts.force=false]
 */
exports.installDependencies = (dependencies, cwd, opts = {}) => new Promise((resolve, reject) => {
    const cmdParts = ['npm', 'install', '--no-save'];
    if (opts.force) {
        cmdParts.push('--force');
    }
    for (const [name, version] of dependencies) {
        const str = `${name}@${version}`;
        cmdParts.push(str);
    }
    exec(cmdParts.join(' '), { cwd }, (err, stdout, stderr) => {
        if (err) {
            reject(err);
            return;
        }
        process.stdout.write(stdout);
        process.stderr.write(stderr);
        resolve();
    });
});
