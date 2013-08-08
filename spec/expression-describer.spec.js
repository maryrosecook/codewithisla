var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
var expressionDescriber = require('../src/expression-describer')
                            .expressionDescriber;
var Isla = require('../node_modules/isla/src/isla.js').Isla;

describe('expressionDescriber', function() {
  describe('type_assignment', function() {
    it('should print right help for scalar assignee', function() {
      var code = "x is a circle";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code, env))
        .toEqual("Makes a circle called x.");
    });

    it('should print right help for deep object assignee', function() {
      var code = "x is a d\nx y is a d\nx y z is a d";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code.split("\n")[2], env))
        .toEqual("Makes a d called x y z.");
    });
  });

  describe('value_assignment', function() {
    it('should print right help for scalar assignee', function() {
      var code = "age is '1'";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code, env))
        .toEqual("age is now '1'.");
    });

    it('should print right help for object assignee', function() {
      var code = "x is a person\nx y is '2'";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code.split("\n")[1], env))
        .toEqual("x y is now '2'.");
    });

    it('should print ref when assigning scalar variable', function() {
      var code = "age is '2'\nx is a person\nx y is age";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code.split("\n")[2], env))
        .toEqual("x y is now age.");
    });

    it('should print ref when assigning deep obj attribute', function() {
      var code = "x is a d\nx y is a d\nx y z is '1'";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code.split("\n")[2], env))
        .toEqual("x y z is now '1'.");
    });

    it('should print error when assigned var not defined', function() {
      var code = "a is b";
      expect(expressionDescriber.describe(code, Isla.Library.getInitialEnv()))
        .toEqual("I have not heard of b.");
    });
  });

  describe('list_assignment', function() {
    describe('add', function() {
      it('should print right help for literal', function() {
        var code = "x is a list\nadd '1' to x";
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(code.split("\n")[1], env))
          .toEqual("Puts '1' into the list called x.");
      });

      it('should print right help for deeply nested obj attr', function() {
        var code = "a is a d\na b is '1'\nx is a d\nx y is a d\nx y z is a list\nadd a b to x y z";
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(code.split("\n")[5], env))
          .toEqual("Puts a b into the list called x y z.");
      });

      it('should report list does not exist if try to add to undefined list', function() {
        var code = "add '1' to l";
        expect(expressionDescriber.describe(code, Isla.Library.getInitialEnv()))
          .toEqual("I have not heard of l.");
      });

      it('should report non-existent item does not exist', function() {
        var env = Isla.Interpreter.interpret("l is a list");
        expect(expressionDescriber.describe("add a to l", env))
          .toEqual("I have not heard of a.");
      });
    });

    describe('take', function() {
      it('should print right help for literal', function() {
        var code = "x is a list\ntake '1' from x";
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(code.split("\n")[1], env))
          .toEqual("Takes '1' out of the list called x.");
      });

      it('should print right help for var', function() {
        var code = "x is a list\ny is a person\ny age is '1'\ntake y age from x";
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(code.split("\n")[3], env))
          .toEqual("Takes y age out of the list called x.");
      });

      it('should print right help for deeply nested obj attr', function() {
        var code = "a is a d\na b is '1'\nx is a d\nx y is a d\nx y z is a list\ntake a b from x y z";
        var env = Isla.Interpreter.interpret(code);
        expect(expressionDescriber.describe(code.split("\n")[5], env))
          .toEqual("Takes a b out of the list called x y z.");
      });

      it('should report list does not exist if try to remove from undefined list', function() {
        var code = "take '1' from l";
        expect(expressionDescriber.describe(code, Isla.Library.getInitialEnv()))
          .toEqual("I have not heard of l.");
      });

      it('should report non-existent item does not exist', function() {
        var env = Isla.Interpreter.interpret("l is a list");
        expect(expressionDescriber.describe("take a from l", env))
          .toEqual("I have not heard of a.");
      });
    });
  });

  describe('invocation', function() {
    it('should print function-specific help for literal param', function() {
      var code = "write '1'";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code, env))
        .toEqual("Writes out '1'.");
    });

    it('should print function-specific help for var param', function() {
      var code = "x is a person\nx age is '1'\nwrite x age";
      var env = Isla.Interpreter.interpret(code);
      expect(expressionDescriber.describe(code.split("\n")[2], env))
        .toEqual("Writes out x age.");
    });

    it('should report error when fn not defined', function() {
      var code = "blah '1'";
      expect(expressionDescriber.describe(code, Isla.Library.getInitialEnv()))
        .toEqual("I have not heard of blah.");
    });
  });
});
