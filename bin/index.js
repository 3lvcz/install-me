const { installDependencies } = require('../lib/installer');
const params = require('../lib/read-params')();
const dependencies = require('../lib/read-dependencies')(params.manifest, params.groups);

function printMessage(msg) {
    process.stdout.write(`${msg}\n`);
}

printMessage(`manifest: ${params.manifest}`);
printMessage(`target: ${params.target}`);
printMessage(`force: ${params.force}`);

installDependencies(dependencies, params.target, { force: params.force })
    .then(() => printMessage('Done.'))
    .catch((e) => {
        process.stderr.write(e.toString());
        process.exit(1);
    });
