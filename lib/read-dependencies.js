/**
 * @param {string} configPath Absolute path to config json file.
 * @param {string[]} groups Array of dependency groups names.
 * @return {(string[])[]} [[name, version], [name, version]]
 */
module.exports = (configPath, groups) => {
    const config = require(configPath);
    const groupSet = new Set([...groups]);
    const dependencyMap = [...groupSet].reduce((dependencies, group) => {
        if (config[group]) {
            for (const dependency of Object.keys(config[group])) {
                const version = config[group][dependency];
                if (dependency && version) {
                    dependencies.set(dependency, version);
                }
            }
        }
        return dependencies;
    }, new Map());
    return [...dependencyMap];
};
