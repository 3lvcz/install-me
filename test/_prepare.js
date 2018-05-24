const { readdirSync } = require('fs');
const { join } = require('path');

const STUBS = join(__dirname, 'stubs');

readdirSync(STUBS)
    .map(filename => join(STUBS, filename))
    .forEach(require);

global.expect = require('chai').expect;
