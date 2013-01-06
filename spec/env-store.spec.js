var EnvStore = require('../src/env-store').EnvStore;

describe('EnvStore', function() {
  var e;
  beforeEach(function() {
    e = new EnvStore();
  });

  describe('commit', function() {
    it('should throw if tempEnv undefined on commit event', function() {
      expect(function() {
        e.write({ event:"commit" });
      }).toThrow();
    });

    it('should commit temp on commit event', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual({ a:1 });
    });

    it('should clone env committed', function() {
      var env = { a:1 };
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual({ a:1 }); // added it
      expect(e.latest() !== env).toEqual(true);
    });
  });

  describe('temp', function() {
    it('should add an env on temp event', function() {
      e.write({ event:"temp", env:{ a:1 } });
      expect(e.latest()).toEqual({ a:1 });
    });

    it('should reject undefined and null envs', function() {
      expect(function() {
        e.write({ event:"temp", env:undefined });
      }).toThrow();

      expect(function() {
        e.write({ event:"temp", env:null });
      }).toThrow();
    });

    it('should clone temp env', function() {
      var env = { a:1 };
      e.write({ event:"temp", env:env });
      expect(e.latest()).toEqual({ a:1 }); // added it
      expect(e.latest() !== env).toEqual(true);
    });

    it('should overwrite temp', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"temp", env:{ b:2 } });
      expect(e.latest()).toEqual({ b:2 });
    });
  });

  describe('latest', function() {
    it('should return temp if that was latest added', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      e.write({ event:"temp", env:{ b:2 } });
      expect(e.latest()).toEqual({ b:2 });
    });

    it('should return committed if no temp', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual({ a:1 });
    });
  });

  describe('latestCommitted', function() {
    it('should return latest committed', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      expect(e.latestCommitted()).toEqual({ a:1 });
      e.write({ event:"temp", env:{ b:2 } });
      e.write({ event:"commit" });
      expect(e.latestCommitted()).toEqual({ b:2 });
    });

    it('should return latest committed even if newer temp', function() {
      e.write({ event:"temp", env:{ a:1 } });
      e.write({ event:"commit" });
      e.write({ event:"temp", env:{ b:2 } });
      expect(e.latestCommitted()).toEqual({ a:1 });
    });
  });
});
