
var environments = {};

environments.staging = {
    'httpPort': 1234,
    'envName': 'staging'
};
environments.production = {
    'httpPort': 4321,
    'envName': 'production'
};

var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
var envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;