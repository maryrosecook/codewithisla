var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;
var nodeDescriber = require('../src/node-describer').nodeDescriber;
var Isla = require('../node_modules/isla/src/isla.js').Isla;

describe('nodeDescriber', function() {
  describe('assignee is assignment', function() {
    // note: in these tests the env in created from the execution of
    // all the code, not the execution of the code up to the point of
    // the line in which the node appears

    it('should describe scalar primitive assignee', function() {
      var code = "age is '1'";
      //          ___
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 0, env).body)
        .toEqual("'1'");
    });

    it('should describe obj type assignee', function() {
      var code = "mary is a person\nmary age is '31'";
      //          ____
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 0, env).body)
        .toEqual("a person\n  age is '31'\n");
    });

    it('should describe obj assignee', function() {
      var code = "mary is a person\nmary age is '31'";
      //                            ____
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 17, env).body)
        .toEqual("a person\n  age is '31'\n");
    });

    it('should describe obj attr assignee', function() {
      var code = "mary is a person\nmary age is '31'";
      //                                 ___
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 22, env).body)
        .toEqual("'31'");
    });
  });

  describe('value in assignment', function() {
    it('should describe obj value', function() {
      var code = "x is a guy\ny is a guy\ny age is '1'\nx age is y age";
      //                                                         _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 44, env).body)
        .toEqual("a guy\n  age is '1'\n");
    });

    it('should describe obj attr value', function() {
      var code = "x is a guy\ny is a guy\ny age is '1'\nx age is y age";
      //                                                           ___
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 46, env).body)
        .toEqual("'1'");
    });
  });

  describe('param in invocation', function() {
    it('should describe scalar primitive', function() {
      var code = "x is '1'\nwrite x";
      //                          _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 15, env).body)
        .toEqual("'1'");
    });

    it('should describe obj', function() {
      var code = "x is a guy\nx age is '1'\nwrite x age";
      //                                          _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 30, env).body)
        .toEqual("a guy\n  age is '1'\n");
    });

    it('should describe obj attr', function() {
      var code = "x is a guy\nx age is '1'\nwrite x age";
      //                                            ___
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 32, env).body)
        .toEqual("'1'");
    });
  });

  describe('operand in list assignment', function() {
    it('should describe scalar primitive', function() {
      var code = "basket is a list\nx is '1'\nadd x to basket";
      //                                          _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 30, env).body)
        .toEqual("'1'");
    });

    it('should describe obj', function() {
      var code = "basket is a list\nx is a i\nx y is '1'\nadd x y to basket";
      //                                                      _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 41, env).body)
        .toEqual("a i\n  y is '1'\n");
    });

    it('should describe obj attr', function() {
      var code = "basket is a list\nx is a i\nx y is '1'\nadd x y to basket";
      //                                                        _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 43, env).body)
        .toEqual("'1'");
    });
  });

  describe('list assignment list part', function() {
    it('should describe list when is obj', function() {
      var code = "basket is a list\nadd '1' to basket";
      //                                       ______
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 28, env).body)
        .toEqual("a list\n  '1'\n");
    });

    it('should describe obj when it provides list as attr', function() {
      var code = "x is a i\nx basket is a list\nadd '1' to x basket";
      //                                                   _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 39, env).body)
        .toEqual("a i\n  basket is a list\n    '1'\n");
    });

    it('should describe list that is obj attr', function() {
      var code = "x is a i\nx basket is a list\nadd '1' to x basket";
      //                                                     ______
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 41, env).body)
        .toEqual("a list\n  '1'\n");
    });
  });

  describe('regressions', function() {
    it('should correctly toString() obj attr that is a ref', function() {
      var code = "a is a list\nb is a person\nb a is a";
      //                                        _
      var env = Isla.Interpreter.interpret(code);
      expect(nodeDescriber.describe(code, 28, env).body)
        .toEqual("an empty list");
    });
  });
});
