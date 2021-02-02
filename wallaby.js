module.exports = function () {
    return {
        files: [
            { pattern: '.env', instrument: false },
            'app.js',
            'src/**/*.js',

            'test/init.js',
            'test/helpers/**/*.js',
        ],

        tests: ['test/**/*.js', '!test/init.js', '!test/helpers/**/*.js'],

        testFramework: 'mocha',
        env: {
            type: 'node',
            runner: 'node',
        },
        runMode: 'onsave',
        // delay: 2000,
        // debug: true,
        workers: {
            initial: 1,
            regular: 1,
            restart: true,
        },
        setup: function (wallaby) {
            // process.env.NODE_ENV = 'test'

            wallaby.delayStart()
            wallaby.testFramework.ui('tdd')
            const MongodbMemoryServer = require('mongodb-memory-server')
                .MongoMemoryServer
            global.mongoServer = new MongodbMemoryServer()
            global.mongoServer.getUri('wallaby-test').then((mongouri) => {
                process.env.WALLABY_MONGO_URI = mongouri
                console.log('WALLABY_MONGO_URI ', process.env.WALLABY_MONGO_URI)
                wallaby.start()
            })
        },
        teardown: function (wallaby) {
            global.mongoServer.stop()
            console.log('Teardown')
            console.log('Current worker id: ' + wallaby.workerId)
            console.log('Current session id: ' + wallaby.sessionId)
        },
    }
}
