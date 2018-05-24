const { installDependencies, installDependency } = require('../lib/installer');
const { exec } = require('./stubs/child_process');

describe('installer', () => {
    const reset = () => {
        exec.spy.resetHistory();
        exec.resetHistory();
    };
    describe('installDependencies', () => {
        afterEach(reset);
        it('should call `npm` properly', () => {
            const promise = installDependencies([
                ['module1', '^1.2.3'],
                ['module2', 'latest'],
            ], __dirname);
            expect(promise).to.be.instanceOf(Promise);
            expect(exec.spy.calledOnce).to.equal(true);

            const { firstCall: { args: [cmd, opts] } } = exec.spy;
            // check cmd
            expect(cmd).to.be.a('string');
            const [program, command, ...params] = cmd.split(/\s+/g);
            expect(program).to.equal('npm');
            expect(command).to.match(/^i(nstall)?$/);
            expect(params).to.have.members(['--no-save', 'module1@^1.2.3', 'module2@latest']);
            // check opts
            expect(opts).to.have.property('cwd').which.equal(__dirname);
        });
    });
    describe('installDependency', () => {
        afterEach(reset);
        it('should call `npm` properly', () => {
            const promise = installDependency('module-name', '^1.2.3', __dirname);
            expect(promise).to.be.instanceOf(Promise);
            expect(exec.spy.calledOnce).to.equal(true);

            const { firstCall: { args: [cmd, opts] } } = exec.spy;
            // check cmd
            expect(cmd).to.be.a('string');
            const [program, command, ...params] = cmd.split(/\s+/g);
            expect(program).to.equal('npm');
            expect(command).to.match(/^i(nstall)?$/);
            expect(params).to.have.members(['--no-save', 'module-name@^1.2.3']);
            // check opts
            expect(opts).to.have.property('cwd').which.equal(__dirname);
        });
        it('should not use force flag by default', () => {
            installDependency('module-name', '^1.2.3', __dirname);
            const { firstCall: { args: [cmd] } } = exec.spy;
            const [,, ...params] = cmd.split(/\s+/g);
            expect(params).to.not.include(['-f']);
            expect(params).to.not.include(['--force']);
        });
        it('should use force flag, when `opts.force` is `true`', () => {
            installDependency('module-name', '^1.2.3', __dirname, { force: true });
            const { firstCall: { args: [cmd] } } = exec.spy;
            const [,, ...params] = cmd.split(/\s+/g);
            const forceFlags = params.filter(param => /^(-f|--force)$/.test(param));
            expect(forceFlags).to.have.length(1);
        });
    });
});
