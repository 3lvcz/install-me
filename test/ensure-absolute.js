const { join } = require('path');
const ensureAbsolute = require('../lib/ensure-absolute');

describe('ensureAbsolute', () => {
    it('should convert relative path into absolute using given `cwd`', () => {
        const relativePath = 'some/dir';
        const expected = join(process.cwd(), relativePath);
        const result = ensureAbsolute(process.cwd(), relativePath);
        expect(result).to.equal(expected);
    });

    it('should not change absolute path', () => {
        const absolutePath = '/some/dir';
        const result = ensureAbsolute(process.cwd(), absolutePath);
        expect(result).to.equal(absolutePath);
    });
});
