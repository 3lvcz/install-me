#!/usr/bin/env node

const { join } = require('path');
const { installDependencies } = require('../lib/installer');
const params = require('../lib/read-params')();
const dependencies = require('../lib/read-dependencies')(params.manifest, params.groups);

function printMessage(msg) {
    process.stdout.write(`${msg}\n`);
}

if (!params.groups.length) {
    printMessage('You should call `install-em` with at least one dependency group. Abort.');
    process.exit(0);
}

if (!dependencies.length) {
    printMessage('No dependencies to install. Abort.');
    process.exit(0);
}

printMessage(`will install: ${dependencies.length} dependencies`);
printMessage(`from: "${params.manifest}"`);
printMessage(`into: "${join(params.target, 'node_modules')}"`);

installDependencies(dependencies, params.target, { force: params.force })
    .then(() => printMessage('Done.'))
    .catch((e) => {
        process.stderr.write(e.toString());
        process.exit(1);
    });
