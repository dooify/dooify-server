// Generated by CoffeeScript 1.12.4
(function() {
  var FaceCommunicator, Plan, Session, activateReferral, addUserToSession, c, createFacebookLogin, createReferral, getOrCreateFacebookLogin;

  Plan = require('../helpers/plan');

  c = require('../common_tasks');

  Session = require('../../logic/session');

  FaceCommunicator = require('./face_communicator');

  createReferral = require('../create_referral');

  activateReferral = require('../activate_referral');

  getOrCreateFacebookLogin = function(args, cb) {
    return c.findOne('facebook_login.fbUserId = fbUserId')(args, function(answer) {
      if (answer.facebook_login != null) {
        return cb({
          facebook_login: answer.facebook_login
        });
      } else if (args.args.onlyLogin) {
        return cb({
          error: 'does not exist',
          description: "Sorry, we couldn't find such a Facebook login"
        });
      } else {
        return createFacebookLogin(args, cb);
      }
    });
  };

  createFacebookLogin = Plan(FaceCommunicator.getFacebookProfile, Plan(c.set('args = {}'), c.create('user')), Plan(c.set('args = {}'), c.set('args.userId = user.id'), c.set('args.fbUserId = fbProfile.id'), c.create('facebook_login')), Plan(c.set('args = {}'), c.set('args.userId = user.id'), c.set('args.firstName = fbProfile.first_name'), c.set('args.lastName = fbProfile.last_name'), c.set('description = ""'), c.create('profile')), Plan(c.set('args = {}'), c.set('args.userId = user.id'), c.set('args.mail = fbProfile.email'), c.create('contact')), Plan(c.set('args = {}'), c.set('args.userId = user.id'), c.set('args.hours = 2'), c.create('bonus')), function(arg, cb) {
    var args, campaignCode, user;
    args = arg.args, user = arg.user;
    campaignCode = args.campaignCode;
    if (!campaignCode) {
      cb({});
      return;
    }
    args = {
      lucaUserId: user.get('id'),
      vitoUserId: campaignCode
    };
    return createReferral({
      user: user,
      args: args
    }, function(answer) {
      if (answer.error) {
        return cb({});
      } else {
        return activateReferral({
          lucaUserId: user.get('id')
        }, cb);
      }
    });
  }, c.select('facebook_login'));

  addUserToSession = function(arg, cb) {
    var facebook_login, session;
    session = arg.session, facebook_login = arg.facebook_login;
    return Session.set(session, 'userId', facebook_login.get('userId'), function() {
      return cb({});
    });
  };

  module.exports = Plan(c.getSession, FaceCommunicator.exchangeCodeForToken, FaceCommunicator.exchangeTokenForFbUserid, getOrCreateFacebookLogin, addUserToSession, c.select('facebook_login'));

}).call(this);
