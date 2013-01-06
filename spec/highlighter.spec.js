var highlighter = require('../src/highlighter').Highlighter;

describe('Highlighter', function() {
  describe('highlighting', function() {
    it('should return undefined for unparseable markup', function() {
      var markup = highlighter.highlight("x is");
      expect(markup).toBeUndefined();
    });

    it('should mark up token where syntax annotation on top level', function() {
      var markup = highlighter.highlight("x is y");
      expect(markup.indexOf("<span class='keyword'>is</span>&nbsp;") >= 0).toEqual(true);
    });

    it('should mark up token w/ syntax annotation on lower level', function() {
      var markup = highlighter.highlight("x is y");
      expect(markup.indexOf("<span class='variable'>x</span>&nbsp;") >= 0).toEqual(true);
    });

    it('should work when single token has two parts each w/ a syntax annotation', function() {
      var markup = highlighter.highlight("x y is 'z'");
      expect(markup.indexOf("<span class='variable'>x</span>&nbsp;") >= 0).toEqual(true);
      expect(markup.indexOf("<span class='attribute'>y</span>&nbsp;") >= 0).toEqual(true);
    });

    it('should retain extra spaces between tokens', function() {
      var markup = highlighter.highlight("x is   y");
      var exp = "<span class='variable'>x</span>&nbsp;<span class='keyword'>is</span>&nbsp;&nbsp;&nbsp;<span class='variable'>y</span>";
      expect(markup).toEqual(exp);
    });

    it('should work for token w space in it', function() {
      var markup = highlighter.highlight("x is a y");
      var exp = "<span class='variable'>x</span>&nbsp;<span class='keyword'>is&nbsp;a</span>&nbsp;<span class='type'>y</span>";
      expect(markup).toEqual(exp);
    });
  });
});
