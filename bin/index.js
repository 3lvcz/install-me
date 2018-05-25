#!/usr/bin/env node

const { join } = require('path');
const { installDependencies } = require('../lib/installer');
const params = require('../lib/read-params')();
const dependencies = require('../lib/read-dependencies')(params.manifest, params.groups);

function printMessage(msg) {
    // eslint-disable-next-line no-console
    console.log(msg);
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
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    });
