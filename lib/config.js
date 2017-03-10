const _ = require('lodash');

let config;

const initialize = _.once((configFilePath, overrides) => {
    return config = _.merge({}, require(configFilePath), overrides);
});

const get = (key) => {
    if (!config) {
        initialize('../config.json');
    }
    return config[key];
};

module.exports = {
    initialize: initialize,
    get: get
};
