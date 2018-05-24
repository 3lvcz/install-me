const childProcess = require('child_process');
const sinon = require('sinon');

const execSpy = sinon.spy();
exports.exec = sinon.stub(childProcess, 'exec').callsFake(execSpy);
exports.exec.spy = execSpy;
