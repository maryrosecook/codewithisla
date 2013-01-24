var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
var expressionDescriber = require('../src/expression-describer')
                            .expressionDescriber;
var Isla = require('../node_modules/isla/src/isla.js').Isla;

describe('expressionDescriber', function() {
  describe('type_assignment', function() {
    it('should print right help for scalar assignee', function() {
      var code = "x is a circle";
      var node = codeAnalyzer.expression(code);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("Makes a circle called x.");
    });

    it('should print right help for object assignee', function() {
      var code = "x is a person\nx y is a circle";
      var node = codeAnalyzer.expression(code.split("\n")[1]);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("Makes a circle called x y.");
    });
  });

  describe('value_assignment', function() {
    it('should print right help for scalar assignee', function() {
      var code = "age is '1'";
      var node = codeAnalyzer.expression(code);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("age is now '1'.");
    });

    it('should print right help for object assignee', function() {
      var code = "x is a person\nx y is '2'";
      var node = codeAnalyzer.expression(code.split("\n")[1]);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("x y is now '2'.");
    });

    it('should print ref when assigning scalar variable', function() {
      var code = "age is '2'\nx is a person\nx y is age";
      var node = codeAnalyzer.expression(code.split("\n")[2]);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("x y is now age.");
    });

    it('should print ref when assigning obj attribute', function() {
      var code = "x is a person\nx age is '2'\ny is a person\ny age is x age";
      var node = codeAnalyzer.expression(code.split("\n")[3]);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("y age is now x age.");
    });
  });

  describe('list_assignment', function() {
    describe('add', function() {
      it('should print right help for literal', function() {
        var code = "x is a list\nadd '1' to x";
        var node = codeAnalyzer.expression(code.split("\n")[1]);
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(node, env))
          .toEqual("Puts '1' into the list called x.");
      });

      it('should print right help for var', function() {
        var code = "x is a list\ny is a person\ny age is '1'\nadd y age to x";
        var node = codeAnalyzer.expression(code.split("\n")[3]);
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(node, env))
          .toEqual("Puts y age into the list called x.");
      });
    });

    describe('take', function() {
      it('should print right help for literal', function() {
        var code = "x is a list\ntake '1' from x";
        var node = codeAnalyzer.expression(code.split("\n")[1]);
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(node, env))
          .toEqual("Takes '1' out of the list called x.");
      });

      it('should print right help for var', function() {
        var code = "x is a list\ny is a person\ny age is '1'\ntake y age from x";
        var node = codeAnalyzer.expression(code.split("\n")[3]);
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(node, env))
          .toEqual("Takes y age out of the list called x.");
      });
    });
  });

  describe('invocation', function() {
    it('should print function-specific help for literal param', function() {
      var code = "write '1'";
      var node = codeAnalyzer.expression(code);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("Writes out '1'.");
    });

    it('should print function-specific help for var param', function() {
      var code = "x is a person\nx age is '1'\nwrite x age";
      var node = codeAnalyzer.expression(code.split("\n")[2]);
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(node, env))
        .toEqual("Writes out x age.");
    });
  });


});
