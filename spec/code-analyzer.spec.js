var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;

describe('codeAnalyzer', function() {
  describe('parses()', function() {
    it('should return false for code that does not parse', function() {
      expect(codeAnalyzer.parses("a is")).toEqual(false);
    });

    it('should return true for code that parses', function() {
      expect(codeAnalyzer.parses("a is '1'")).toEqual(true);
    });
  });


  describe('expression()', function() {
    it('should return ast for parseable code', function() {
      expect(codeAnalyzer.expression("a is b")).toBeDefined();
    });

    it('should return undefined for unparseable code', function() {
      expect(codeAnalyzer.expression("a is")).toBeUndefined();
    });

    it('should throw if get more than one expression', function() {
      expect(function() {
        codeAnalyzer.expression("a is '1'\nb is '2'");
      }).toThrow();
    });
  });

  describe('expressionTokens()', function() {
    it('should return ast for parseable code', function() {
      expect(codeAnalyzer.expressionTokens("a is b")).toBeDefined();
    });

    it('should return undefined for unparseable code', function() {
      expect(codeAnalyzer.expressionTokens("a is")).toBeUndefined();
    });

    it('should throw if get more than one expression', function() {
      expect(function() {
        codeAnalyzer.expressionTokens("a is '1'\nb is '2'");
      }).toThrow();
    });
  });

  describe('expressionSyntaxTokens()', function() {
    it('should include code, syntax, index, node on el', function() {
      var s = codeAnalyzer.expressionSyntaxTokens("a is '1'");
      expect(s[0].code).toEqual("a");
      expect(s[0].syntax).toEqual("variable");
      expect(s[0].index).toEqual(0);
      expect(s[0].node).toBeDefined();
    });
  });

  describe('getLineNumber()', function() {
    describe('line one', function() {
      it('should return undefined if index at nl', function() {
        expect(codeAnalyzer.getLineNumber("\n", 0)).toBeUndefined();
      });

      it('should return undefined if index 0 and line has 0 chars', function() {
        expect(codeAnalyzer.getLineNumber("", 0)).toBeUndefined();
      });

      it('should return 0 if at line beginning and line has more than one char', function() {
        expect(codeAnalyzer.getLineNumber("a", 0)).toEqual(0);
      });

      it('should return 0 if index at end of first line', function() {
        expect(codeAnalyzer.getLineNumber("abc", 2)).toEqual(0);
      });

      it('should return undefined if index one past end of line', function() {
        expect(codeAnalyzer.getLineNumber("abc", 3)).toBeUndefined();
      });
    });

    describe('line two', function() {
      it('should return undefined if index at nl', function() {
        expect(codeAnalyzer.getLineNumber("\n\n", 1)).toBeUndefined();
      });

      it('should return undefined if index 0 and line has 0 chars', function() {
        expect(codeAnalyzer.getLineNumber("aoe\n", 4)).toBeUndefined();
      });

      it('should return 0 if at line beginning and line has more than one char', function() {
        expect(codeAnalyzer.getLineNumber("ab\na", 3)).toEqual(1);
      });

      it('should return 0 if index at end of line', function() {
        expect(codeAnalyzer.getLineNumber("abc\nabc", 6)).toEqual(1);
      });

      it('should return undefined if index one past end of line', function() {
        expect(codeAnalyzer.getLineNumber("abc\nabc", 7)).toBeUndefined();
      });
    });

    describe('line three', function() {
      it('should find ln if move over empty line', function() {
        expect(codeAnalyzer.getLineNumber("abc\n\nabc", 6)).toEqual(2);
      });
    });
  });

  describe('getLine()', function() {
    it('should return undefined lineNumber undefined', function() {
      expect(codeAnalyzer.getLine("\n")).toBeUndefined();
    });

    it('should return line 0 if ln is 0 and no nl', function() {
      expect(codeAnalyzer.getLine("abc", 0)).toEqual("abc");
    });

    it('should return line 0 if ln is 0 and have nl', function() {
      expect(codeAnalyzer.getLine("abc\n", 0)).toEqual("abc");
    });

    it('should return line 1 if ln is 1', function() {
      expect(codeAnalyzer.getLine("abc\ndef", 1)).toEqual("def");
    });

    it('should return undefined if ln is 2 but no line 3', function() {
      expect(codeAnalyzer.getLine("abc\ndef", 2)).toBeUndefined();
    });

    it('should return line 3 if ln is 2 and first 2 lines are empty', function() {
      expect(codeAnalyzer.getLine("\n\nabc", 2)).toEqual("abc");
    });
  });

  describe('getCode()', function() {
    it('should return code for literal', function() {
      expect(codeAnalyzer.getCode(codeAnalyzer.expressionTokens("a is '1'")[2]))
        .toEqual("'1'");
    });

    it('should return normal token for identifier', function() {
      expect(codeAnalyzer.getCode(codeAnalyzer.expressionTokens("a is '1'")[0]))
        .toEqual("a");
    });
  });

  describe('getLineIndex()', function() {
    describe('first line', function() {
      it('should return 1 for char 2', function() {
        expect(codeAnalyzer.getLineIndex("abc", 1)).toEqual(1);
      });

      it('should return 2 for char 3', function() {
        expect(codeAnalyzer.getLineIndex("abc", 2)).toEqual(2);
      });

      it('should return 0 for char 0', function() {
        expect(codeAnalyzer.getLineIndex("abc", 0)).toEqual(0);
      });
    });

    describe('second line', function() {
      it('should return 1 for char 2', function() {
        expect(codeAnalyzer.getLineIndex("abc\nabc", 1)).toEqual(1);
      });

      it('should return 2 for char 3', function() {
        expect(codeAnalyzer.getLineIndex("abc\nabc", 2)).toEqual(2);
      });

      it('should return 0 for char 0', function() {
        expect(codeAnalyzer.getLineIndex("abc\nabc", 0)).toEqual(0);
      });
    });
  });

  describe('getSyntaxTokenIndex', function() {
    describe('line one', function() {
      it('should say first token when index in first token', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 2)).toEqual(0);
      });

      it('should say second token when index in second token', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 8)).toEqual(1);
      });

      it('should say second token when index right at beginning of second', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 6)).toEqual(1);
      });

      it('should say third token when index right at beginning of third', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 11)).toEqual(2);
      });

      it('should say no token when in gap between first and second', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 5)).toBeUndefined();
      });

      it('should say no token when in gap between second and third', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 10)).toBeUndefined();
      });

      it('should say first token when index right at beginning', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 0)).toEqual(0);
      });

      it('should say last token when index right at end', function() {
        var text = "jimmy is a giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 17)).toEqual(2);
      });

      it('should cope w extra whitespace', function() {
        var text = "jimmy is a      giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 16)).toEqual(2);
      });

      it('should say undefined on last char of extra whitespace', function() {
        var text = "jimmy is a      giraffe";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 15)).toBeUndefined();
      });

      it('should return undefined when hover over newline', function() {
        var text = "timmy is a giraffe\n";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 18)).toBeUndefined();
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 19)).toBeUndefined();
      });
    });

    describe('line two', function() {
      it('should say second token when index right at beginning of second', function() {
        var text = "x is a circle\ny is x";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 16)).toEqual(1);
      });

      it('should say first token when at beginning of second line', function() {
        var text = "x is a circle\ny is x";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 14)).toEqual(0);
      });

      it('should say third token when index right at beginning of third', function() {
        var text = "x is a circle\ny is x";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 19)).toEqual(2);
      });

      it('should say no token when in gap between second and third', function() {
        var text = "x is a circle\ny is x";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 18)).toBeUndefined();
      });

      it('should say last token when index right at end', function() {
        var text = "x is a circle\ny is x";
        expect(codeAnalyzer.getSyntaxTokenIndex(text, 19)).toEqual(2);
      });
    });
  });

  describe('isAtNewline', function() {
    it('should return true when index is at start of newline', function() {
      expect(codeAnalyzer.isAtNewline("a\nb", 1)).toEqual(true);
    });

    it('should return false when part way through newline', function() {
      expect(codeAnalyzer.isAtNewline("a\nb", 2)).toEqual(false);
    });

    it('should return false when not part at newline', function() {
      expect(codeAnalyzer.isAtNewline("a\nb", 0)).toEqual(false);
      expect(codeAnalyzer.isAtNewline("a\nb", 3)).toEqual(false);
    });
  });
});
