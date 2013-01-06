var TextGrabber = require('../src/text-grabber').TextGrabber;
var Eventer = require('../src/eventer').Eventer;

describe('TextGrabber', function() {
  describe('general behaviour', function() {
    var tg;
    beforeEach(function() {
      tg = new TextGrabber();
    });

    describe('keypress', function() {
      it('should add text when keypress', function() {
        tg.write({ event:"keypress", text:"abc" });
        expect(tg.getText()).toEqual("abc\n");
      });

      it('should add nnewline after current line inserted following keypress', function() {
        tg.write({ event:"keypress", text:"abc" });
        expect(tg.getText().substring(3)).toEqual("\n");
      });
    });

    describe('submit', function() {
      it('should add text when submit', function() {
        tg.write({ event:"submit", text:"abc" });
        expect(tg.getText()).toEqual("abc\n");
      });

      it('should add nnewline after submit', function() {
        tg.write({ event:"submit", text:"abc" });
        expect(tg.getText().substring(3)).toEqual("\n");
      });
    });

    describe('sequence of inputs', function() {
      it('should add mustiple submits', function() {
        tg.write({ event:"submit", text:"abc" });
        tg.write({ event:"submit", text:"def" });
        expect(tg.getText()).toEqual("abc\ndef\n");
      });

      it('should include a keypress with submitted text', function() {
        tg.write({ event:"submit", text:"abc" });
        tg.write({ event:"submit", text:"def" });
        tg.write({ event:"keypress", text:"ghi" });
        expect(tg.getText()).toEqual("abc\ndef\nghi\n");
      });

      it('should clear out current line on submission', function() {
        tg.write({ event:"submit", text:"abc" });
        tg.write({ event:"keypress", text:"ghi" });
        expect(tg.getText()).toEqual("abc\nghi\n");
        tg.write({ event:"submit", text:"def" });
        expect(tg.getText()).toEqual("abc\ndef\n");
      });
    });
  });
});
