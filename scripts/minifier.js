// Produces the minified version.

var packer = require( 'node.packer' ),
resourcesPath = __dirname + '/../resources/';
srcPath = __dirname + '/../src/';
demosPath = __dirname + '/../src/demos/';

packer({
  log : true,
  input : [
    resourcesPath + "jquery-blink.js",
    resourcesPath + "jquery.console.js",
  ],
  minify: true,
  output : resourcesPath + 'console.min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});

packer({
  log : true,
  input : [
    srcPath + "ui.js",
    srcPath + "tutor.js",
    srcPath + "env-store.js",
    srcPath + "eventer.js",
    srcPath + "code-analyzer.js",
    srcPath + "expression-describer.js",
    srcPath + "node-describer.js",
    srcPath + "mapper.js",
    srcPath + "mouser.js",
    srcPath + "console-indicator.js",
    srcPath + "text-helper.js",
    srcPath + "canvas-helper.js",
    srcPath + "helper.js",
    srcPath + "text-grabber.js",
    srcPath + "highlighter.js",
    srcPath + "terminal.js",
    srcPath + "demo-utils.js",
    srcPath + "demo-runner.js",
  ],
  minify: true,
  output : srcPath + 'ide.min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});

packer({
  log : true,
  input : [
    demosPath + "planets.js",
  ],
  minify: true,
  output : demosPath + 'planets.min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});

packer({
  log : true,
  input : [
    demosPath + "shapes.js",
  ],
  minify: true,
  output : demosPath + 'shapes.min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});
