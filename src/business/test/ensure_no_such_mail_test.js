// Generated by CoffeeScript 1.12.4
(function() {
  var User, assert, chai, ensureNoSuchMail;

  chai = require('chai');

  assert = chai.assert;

  User = {};

  ensureNoSuchMail = require('../ensure_no_such_mail')({
    User: User
  });

  describe('check if mail exists', function() {
    it('should send mail parameter to User#where', function(done) {
      User.where = function(args, cb) {
        assert.equal(args.mail, 'the_mail@to_check');
        return done();
      };
      return ensureNoSuchMail('the_mail@to_check', function() {});
    });
    describe('when User#where returns zero objects', function() {
      return it('should return false ', function(done) {
        User.where = function(args, cb) {
          return cb([]);
        };
        return ensureNoSuchMail('the_mail@to_check', function(answer) {
          assert.deepEqual({}, answer);
          return done();
        });
      });
    });
    return describe('when User#where returns objects', function() {
      return it('should return true', function(done) {
        User.where = function(args, cb) {
          return cb(['one']);
        };
        return ensureNoSuchMail('the_mail@to_check', function(answer) {
          assert.deepEqual({
            error: 'mail exists',
            description: 'The mail you provided already exists'
          }, answer);
          return done();
        });
      });
    });
  });

}).call(this);
