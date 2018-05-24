const { dirname, join } = require('path');
const readParams = require('../lib/read-params');

function createAliasTest(shortFlag, longFlag, groupName) {
    it(`should read alias flags ${shortFlag} and ${longFlag} as a same group \`${groupName}\` without repeats`, () => {
        expect(readParams([]).groups).to.have.length(0);
        expect(readParams([shortFlag]).groups).to.eql([groupName]);
        expect(readParams([longFlag]).groups).to.eql([groupName]);
        expect(readParams([shortFlag, longFlag]).groups).to.eql([groupName]);
    });
}

describe('read-params', () => {
    it('should read flag -f, --force as boolean `force` (false by default)', () => {
        expect([
            readParams([]),
            readParams(['-f']),
            readParams(['--force']),
        ].map(params => params.force)).to.eql([false, true, true]);
    });

    createAliasTest('-p', '--prod', 'dependencies');
    createAliasTest('-d', '--dev', 'devDependencies');
    createAliasTest('-o', '--optional', 'optionalDependencies');

    it('should read all given aliases', () => {
        expect(readParams(['-d', '-o', '-p']).groups).to.have.members([
            'dependencies',
            'devDependencies',
            'optionalDependencies',
        ]);
    });

    it('should read custom group names', () => {
        const groups = ['myDependencies', 'yourDependencies'];
        expect(readParams(groups).groups).to.have.members(groups);
    });

    it('should not dublicate alias with custom group names', () => {
        expect(readParams(['devDependencies', '-d']).groups).to.eql(['devDependencies']);
        expect(readParams(['--optional', 'optionalDependencies']).groups).to.eql(['optionalDependencies']);
    });

    it('should ignore paths (not use as custom group name)', () => {
        expect(readParams([__dirname]).groups).to.have.length(0);
    });

    it('should set `manifest` with package.json which is in current cwd, if not given', () => {
        expect(readParams([]).manifest).to.equal(join(process.cwd(), 'package.json'));
    });

    it('should append package.json to `manifest`, if directory path is given', () => {
        expect(readParams(['-m', __dirname]).manifest).to.equal(join(__dirname, 'package.json'));
        expect(readParams(['--manifest', __dirname]).manifest).to.equal(join(__dirname, 'package.json'));
    });

    it('should prepend current cwd to `manifest`, if `*.json` filename is given', () => {
        const fname = 'something.json';
        expect(readParams(['-m', fname]).manifest).to.equal(join(process.cwd(), fname));
        expect(readParams(['--manifest', fname]).manifest).to.equal(join(process.cwd(), fname));
    });

    it('should join `manifest` with current cwd, if relative path to a *.json file is given', () => {
        const path = '../some/thing.json';
        expect(readParams(['-m', path]).manifest).to.equal(join(process.cwd(), path));
        expect(readParams(['--manifest', path]).manifest).to.equal(join(process.cwd(), path));
    });

    it('should join prepend cwd and append "package.json", if relative path to a directory is given', () => {
        const path = '../some';
        expect(readParams(['-m', path]).manifest).to.equal(join(process.cwd(), path, 'package.json'));
        expect(readParams(['--manifest', path]).manifest).to.equal(join(process.cwd(), path, 'package.json'));
    });

    it('should set `manifest` to given value, if it\'s absolute path to a *.json file', () => {
        const path = join(__dirname, 'something.json');
        expect(readParams(['-m', path]).manifest).to.equal(path);
        expect(readParams(['--manifest', path]).manifest).to.equal(path);
    });

    it('should set `target` to given value, if it\'s absolute path', () => {
        const path = '/some/path';
        expect(readParams(['-t', path]).target).to.equal(path);
        expect(readParams(['--target', path]).target).to.equal(path);
    });

    it('should join `target` with current cwd, if it\'s relative path', () => {
        const path = 'some/path';
        expect(readParams(['-t', path]).target).to.equal(join(process.cwd(), path));
        expect(readParams(['--target', path]).target).to.equal(join(process.cwd(), path));
    });

    it('should use `manifest` directory, if `target` is not set', () => {
        const manifest = join(__dirname, '../package.json');
        expect(readParams(['-m', manifest]).target).to.equal(dirname(manifest));
    });
});
