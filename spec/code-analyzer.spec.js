var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;

describe('codeAnalyzer', function() {
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
