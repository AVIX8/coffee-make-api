module.exports = function () {
    return {
      files: [
        'package.json',   // IMPORTANT
        // 'config/*.js',
        // 'controllers/*.js',
        // 'middlewares/*.js',
        // 'models/*.js',
        // 'routes/*.js',
        // 'src/*.js',
        // {pattern: 'node_modules/chai/index.js', instrument: false},
        // {pattern: 'node_modules/chai-http/index.js', instrument: false},
        // {pattern: 'node_modules/mocha/index.js', instrument: false},
        'src/**/*.js',
        '!test/*.js'
      ],
  
      tests: [
        'test/*.js'
      ],
  
      testFramework: 'mocha',
      env: {
        type: 'node',
        params: {
          runner: '--experimental-vm-modules'
        }
      },
      workers: { restart: true }  // IMPORTANT
    };
  };
  