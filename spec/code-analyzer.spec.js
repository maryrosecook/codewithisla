var codeAnalyzer = require('../src/code-analyzer').codeAnalyzer;

describe('codeAnalyzer', function() {
  describe('getSyntaxTokenIndex', function() {
    it('should indicate first token when index in first token', function() {
      var text = "jimmy is a giraffe";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 2)).toEqual(0);
    });

    it('should indicate second token when index in second token', function() {
      var text = "jimmy is a giraffe";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 8)).toEqual(1);
    });

    it('should indicate first token when index right at beginning', function() {
      var text = "jimmy is a giraffe";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 0)).toEqual(0);
    });

    it('should indicate last token when index right at end', function() {
      var text = "jimmy is a giraffe";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 18)).toEqual(2);
    });

    it('should cope w extra whitespace', function() {
      var text = "jimmy is a      giraffe";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 17)).toEqual(2);
    });

    it('should return undefined when hover over newline', function() {
      var text = "timmy is a giraffe\n";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 18)).toBeUndefined();
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 19)).toBeUndefined();
    });

    it('should return first token on second line', function() {
      var text = "x is a circle\ny is x";
      expect(codeAnalyzer.getSyntaxTokenIndex(text, 15)).toEqual(0);
    });
  });

  describe('isInNewline', function() {
    it('should return true when index is at start of newline', function() {
      expect(codeAnalyzer.isInNewline("a\nb", 1)).toEqual(true);
    });

    it('should return true when part way through newline', function() {
      expect(codeAnalyzer.isInNewline("a\nb", 2)).toEqual(true);
    });

    it('should return false when not part at newline', function() {
      expect(codeAnalyzer.isInNewline("a\nb", 0)).toEqual(false);
      expect(codeAnalyzer.isInNewline("a\nb", 3)).toEqual(false);
      expect(codeAnalyzer.isInNewline("a\nb", 4)).toEqual(false);
    });
  });

  describe('isAtNewlineStart', function() {
    it('should return true when index is at start of newline', function() {
      expect(codeAnalyzer.isAtNewlineStart("a\nb", 1)).toEqual(true);
    });

    it('should return false when part way through newline', function() {
      expect(codeAnalyzer.isAtNewlineStart("a\nb", 2)).toEqual(false);
    });

    it('should return false when not part at newline', function() {
      expect(codeAnalyzer.isAtNewlineStart("a\nb", 0)).toEqual(false);
      expect(codeAnalyzer.isAtNewlineStart("a\nb", 3)).toEqual(false);
      expect(codeAnalyzer.isAtNewlineStart("a\nb", 4)).toEqual(false);
    });
  });
});
