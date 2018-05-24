const { isAbsolute, join } = require('path');

module.exports = (cwd, path) => (isAbsolute(path) ? path : join(cwd, path));
