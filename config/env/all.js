'use strict';

module.exports = {
    app: {
        name: 'boiler-node',
        title: 'BoilerNode',
        description: 'Boilerplate code for node.js REST server using express',
        keywords: 'Node.js, Express, REST'
    },
    sessionSecret: 'BN',
    sessionCollection: 'sessions',
    port: process.env.PORT || 3000
};