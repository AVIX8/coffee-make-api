module.exports = function () {
    return {
      files: [
        {pattern: '.env', instrument: false},
        'app.js',

        'config/*.js',
        'controllers/*.js',
        'middlewares/*.js',
        'models/*.js',
        'routes/*.js',

        'src/**/*.js',
        '!test/*.js'
      ],
  
      tests: [
        'test/**.js'
      ],
  
      testFramework: 'mocha',
      env: {
        type: 'node',
        
      },
      debug: true,
      workers: {
        initial: 1,
        regular: 1,
        recycle: true
      },
      // setup: function (wallaby) {
        // wallaby.testFramework is jasmine/QUnit/mocha object
        // wallaby.testFramework.ui('tdd');
        // wallaby.delayStart();

        // setTimeout(function() {
        //   wallaby.start();
        // }, 5000);
 
        // you can access 'window' object in a browser environment,
        // 'global' object or require(...) something in node environment
      // }
    };
  };
  