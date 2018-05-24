const { join } = require('path');
const readDependencies = require('../lib/read-dependencies');

const customConfig = join(__dirname, 'fixtures', 'custom.json');
const packageConfig = join(__dirname, 'fixtures', 'package.json');

describe('read-dependencies', () => {
    it('should resolve dependency/version pairs from a path to custom config file and dependency groups list', () => {
        const dependencies = readDependencies(customConfig, ['dependencies', 'devel']);
        expect(dependencies.filter(([n, v]) => n === 'dependency' && v === '1.0.0')).to.have.lengthOf(1);
        expect(dependencies.filter(([n, v]) => n === 'tool' && v === 'latest')).to.have.lengthOf(1);
    });

    it('should resolve dependency/version pairs from a classic package.json file and dependency groups list', () => {
        const dependencies = readDependencies(packageConfig, ['dependencies', 'devDependencies', 'custom']);
        expect(dependencies.filter(([n, v]) => n === 'dependency' && v === '1.0.0')).to.have.lengthOf(1);
        expect(dependencies.filter(([n, v]) => n === 'tool' && v === 'latest')).to.have.lengthOf(1);
        expect(dependencies.filter(([n, v]) => n === 'my-component' && v === '^0.0.3-dev')).to.have.lengthOf(1);
    });
});
