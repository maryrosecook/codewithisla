var EnvStore = require('../src/env-store').EnvStore;
var library = require('../node_modules/isla/src/library').Library;

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
      var env = library.getInitialEnv();
      env.ctx.a = 1;
      e.write({ event:"temp", env:env });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual(env);
    });

    it('should clone env committed', function() {
      var env = library.getInitialEnv();
      env.ctx.a = 1;
      e.write({ event:"temp", env:env });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual(env); // added it
      expect(e.latest() !== env).toEqual(true);
    });
  });

  describe('temp', function() {
    it('should add an env on temp event', function() {
      var env = library.getInitialEnv();
      env.ctx.a = 1;
      e.write({ event:"temp", env:env });
      expect(e.latest()).toEqual(env);
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
      var env = library.getInitialEnv();
      env.ctx.a = 1;
      e.write({ event:"temp", env:env });
      expect(e.latest()).toEqual(env); // added it
      expect(e.latest() !== env).toEqual(true);
    });

    it('should overwrite temp', function() {
      var envA = library.getInitialEnv();
      envA.ctx.a = 1;
      var envB = library.getInitialEnv();
      envB.ctx.b = 2;
      e.write({ event:"temp", env:envA });
      e.write({ event:"temp", env:envB });
      expect(e.latest()).toEqual(envB);
    });
  });

  describe('latest', function() {
    it('should return temp if that was latest added', function() {
      var envA = library.getInitialEnv();
      envA.ctx.a = 1;
      var envB = library.getInitialEnv();
      envB.ctx.b = 2;
      e.write({ event:"temp", env:envA });
      e.write({ event:"commit" });
      e.write({ event:"temp", env:envB });
      expect(e.latest()).toEqual(envB);
    });

    it('should return committed if no temp', function() {
      var envA = library.getInitialEnv();
      envA.ctx.a = 1;
      e.write({ event:"temp", env:envA });
      e.write({ event:"commit" });
      expect(e.latest()).toEqual(envA);
    });
  });

  describe('latestCommitted', function() {
    it('should return latest committed', function() {
      var envA = library.getInitialEnv();
      envA.ctx.a = 1;
      var envB = library.getInitialEnv();
      envB.ctx.b = 2;

      e.write({ event:"temp", env:envA });
      e.write({ event:"commit" });
      expect(e.latestCommitted()).toEqual(envA);
      e.write({ event:"temp", env:envB });
      e.write({ event:"commit" });
      expect(e.latestCommitted()).toEqual(envB);
    });

    it('should return latest committed even if newer temp', function() {
      var envA = library.getInitialEnv();
      envA.ctx.a = 1;
      var envB = library.getInitialEnv();
      envB.ctx.b = 2;

      e.write({ event:"temp", env:envA });
      e.write({ event:"commit" });
      e.write({ event:"temp", env:envB });
      expect(e.latestCommitted()).toEqual(envA);
    });
  });

  describe('reference preservation', function() {
    it('should preserve refs when write env', function() {
      var originalEnv = library.getInitialEnv();
      originalEnv.a = {};
      originalEnv.b = originalEnv.a;
      expect(originalEnv.a === originalEnv.b).toEqual(true);
      e.write({ event:"temp", env:originalEnv });
      e.write({ event:"commit" });
      var extendedEnv = e.latest();
      expect(extendedEnv.a !== extendedEnv.b).toEqual(true);
    });
  });
});
