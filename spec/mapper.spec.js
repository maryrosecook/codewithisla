var mapper = require('../src/mapper').mapper;

describe('Mapper', function() {
  describe('offset', function() {
    it('should subtract left and top padding from point', function() {
      expect(mapper.offset({ x:10,y:20 }, { l:5,t:6 })).toEqual({ x:5,y:14 });
    });
  });

  describe('getIndex', function() {
    var p = { x:5, y:10 };

    describe('x coord', function() {
      describe('line pixel extremeties', function() {
        it('should miss first char on line when x = -1', function() {
          expect(mapper.getIndex("a is b", { x:-1, y:1 }, p)).toBeUndefined();
        });

        it('should miss first char on line when x 1px off end', function() {
          expect(mapper.getIndex("a is b", { x:30, y:1 }, p)).toBeUndefined();
        });

        it('should id first char on line when x = 0', function() {
          expect(mapper.getIndex("a is b", { x:0, y:1 }, p)).toEqual(0);
        });

        it('should id last char on line when x on last px of char', function() {
          expect(mapper.getIndex("a is b", { x:29, y:1 }, p)).toEqual(5);
        });
      });

      describe('line extremeties', function() {
        it('should id first char on line', function() {
          expect(mapper.getIndex("a is b", { x:1, y:1 }, p)).toEqual(0);
        });

        it('should id last char on line', function() {
          expect(mapper.getIndex("a is b", { x:27, y:1 }, p)).toEqual(5);
        });
      });

      describe('char pixel extremeties', function() {
        it('should id char when x on first pixel of char', function() {
          expect(mapper.getIndex("a is b", { x:5, y:1 }, p)).toEqual(1);
        });

        it('should id char when x on last pixel of char', function() {
          expect(mapper.getIndex("a is b", { x:4, y:1 }, p)).toEqual(0);
        });
      });
    });

    describe('y coord', function() {
      describe('line pixel extremeties', function() {
        it('should miss when y = -1', function() {
          expect(mapper.getIndex("a is b", { x:1,y:-1 }, p)).toBeUndefined();
        });

        it('should miss when off end of last line', function() {
          expect(mapper.getIndex("a is b\nc is d", { x:1,y:20 }, p))
          .toBeUndefined();
        });

        it('should hit when y = 0', function() {
          expect(mapper.getIndex("a is b", { x:1,y:0 }, p)).toEqual(0);
        });

        it('should hit when y on last px of last line', function() {
          expect(mapper.getIndex("a is b\nc is d", { x:1,y:19 }, p)).toEqual(8);
        });

        it('should hit first line when on last px', function() {
          expect(mapper.getIndex("a is b\nc is d", { x:1,y:9 }, p)).toEqual(0);
        });

        it('should hit second line when on first px', function() {
          expect(mapper.getIndex("a is b\nc is d", { x:1,y:10 }, p)).toEqual(8);
        });
      });
    });
  });
});
