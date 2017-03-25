// Generated by CoffeeScript 1.12.4
(function() {
  var Model, Referral;

  Model = require('./model');

  module.exports = Referral = Model({
    tableName: 'referrals',
    columns: {
      vitoUserId: ['vito_user_id', 'text'],
      lucaUserId: ['luca_user_id', 'text'],
      isActivated: ['is_activated', 'text'],
      hours: ['hours', 'text']
    }
  });

}).call(this);
