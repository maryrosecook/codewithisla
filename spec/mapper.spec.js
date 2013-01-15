var Mapper = require('../src/mapper').Mapper;

var mapper = function(offset) {
  var terminal = {
    getOffset: function() {
      return offset;
    },

    getLineOffset: function() {
      return offset;
    },

    getWidth: function() {
      return 380;
    },

    getCharDimes: function() {
      return { x: 5, y: 10 };
    }
  };
  return new Mapper(terminal);
};

describe('Mapper', function() {
  var c, m;
  beforeEach(function() {
  m = mapper({ l: 0, t: 0 });
  });

  describe('getIndex', function() {
    describe('x coord', function() {
      describe('line pixel extremeties', function() {
        it('should miss first char on line when x = -1', function() {
          expect(m.getIndex("a is b", { x:-1, y:1 })).toBeUndefined();
        });

        it('should miss first char on line when x 1px off end', function() {
          expect(m.getIndex("a is b", { x:30, y:1 })).toBeUndefined();
        });

        it('should id first char on line when x = 0', function() {
          expect(m.getIndex("a is b", { x:0, y:1 })).toEqual(0);
        });

        it('should id last char on line if x on last px of char', function() {
          expect(m.getIndex("a is b", { x:29, y:1 })).toEqual(5);
        });
      });

      describe('line extremeties', function() {
        it('should id first char on line', function() {
          expect(m.getIndex("a is b", { x:1, y:1 })).toEqual(0);
        });

        it('should id last char on line', function() {
          expect(m.getIndex("a is b", { x:27, y:1 })).toEqual(5);
        });
      });

      describe('char pixel extremeties', function() {
        it('should id char when x on first pixel of char', function() {
          expect(m.getIndex("a is b", { x:5, y:1 })).toEqual(1);
        });

        it('should id char when x on last pixel of char', function() {
          expect(m.getIndex("a is b", { x:4, y:1 })).toEqual(0);
        });
      });
    });

    describe('y coord', function() {
      describe('line pixel extremeties', function() {
        it('should miss when y = -1', function() {
          expect(m.getIndex("a is b", { x:1,y:-1 })).toBeUndefined();
        });

        it('should miss when off end of last line', function() {
          expect(m.getIndex("a is b\nc is d", { x:1,y:20 }))
          .toBeUndefined();
        });

        it('should hit when y = 0', function() {
          expect(m.getIndex("a is b", { x:1, y:0 })).toEqual(0);
        });

        it('should hit when y on last px of last line', function() {
          expect(m.getIndex("a is b\nc is d", { x:1,y:19 }))
          .toEqual(7);
        });

        it('should hit first line when on last px', function() {
          expect(m.getIndex("a is b\nc is d", { x:1,y:9 }))
          .toEqual(0);
        });

        it('should hit second line when on first px', function() {
          expect(m.getIndex("a is b\nc is d", { x:1,y:10 }))
          .toEqual(7);
        });
      });
    });

    describe('offset', function() {
      it('should apply offset to point', function() {
        var p = { x:-1, y:-1 };
        expect(m.getIndex("a is b", p)).toBeUndefined(); // no offset
        m = mapper({ l: -1, t: -1 }); // w offset that puts point on char
        expect(m.getIndex("a is b", p)).toEqual(0);
      });
    });
  });

  describe('getLine', function() {
    describe('first line', function() {
      it('should get first line in top left', function() {
        expect(m.getLineNumber("a is b", { x:0, y:0 })).toEqual(0);
      });

      it('should get first line in top right', function() {
        expect(m.getLineNumber("a is b", { x:379, y:0 })).toEqual(0);
      });

      it('should get first line in bottom', function() {
        expect(m.getLineNumber("a is b", { x:0, y:9 })).toEqual(0);
      });

      it('should miss line when to left of top left', function() {
        expect(m.getLineNumber("a is b", { x:-1, y:0 })).toBeUndefined();
      });

      it('should miss line when to right of top right', function() {
        expect(m.getLineNumber("a is b", { x:380, y:0 })).toBeUndefined();
      });

      it('should miss line when above top', function() {
        expect(m.getLineNumber("a is b", { x:0, y:-1 })).toBeUndefined();
      });
    });

    describe('second line', function() {
      it('should get second line in top', function() {
        expect(m.getLineNumber("a is b\na is b", { x:0, y:10 })).toEqual(1);
      });

      it('should get second line in bottom', function() {
        expect(m.getLineNumber("a is b\na is b", { x:379, y:19 })).toEqual(1);
      });

      it('should miss second line when below', function() {
        expect(m.getLineNumber("a is b\na is b", { x:0, y:20 })).toBeUndefined();
      });
    });
  });
});
