var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
var nodeDescriber = require('../src/node-describer').nodeDescriber;
var Isla = require('../node_modules/isla/src/isla.js').Isla;

describe('nodeDescriber', function() {
  describe('assignee', function() {
    it('should set value in description for string', function() {
      var code = "age is '1'";
      var node = codeAnalyzer.expressionTokens(code)[0];
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(node, env).body).toEqual("1");
    });

    it('should set value in description for obj', function() {
      var code = "mary is a person\nmary age is '31'";
      var node = codeAnalyzer.expressionTokens(code)[0];
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(node, env).body).toEqual("a person\n  age is '31'\n");
    });
  });
});
