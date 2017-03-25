// Generated by CoffeeScript 1.12.4
(function() {
  var User, assert, chai, query, reset_db;

  reset_db = require('./reset_db');

  chai = require('chai');

  assert = chai.assert;

  query = require('../');

  User = require('../user');

  describe('user', function() {
    before(function(done) {
      return reset_db(done);
    });
    return it('should have fields', function(done) {
      var u;
      u = User({
        firstName: 'first',
        lastName: 'last',
        mail: 'mail@mail',
        phone: '070',
        description: 'description',
        imageId: 'image_id',
        password: 'password'
      });
      return u.save(function() {
        return User.find(u.get('id'), function(u2) {
          assert.isTrue(u.equals(u2));
          return done();
        });
      });
    });
  });

}).call(this);
