// Generated by CoffeeScript 1.12.4
(function() {
  module.exports = function(stuff, cb) {
    return cb({
      config: {
        group: {
          name: process.env.DOO_NAME,
          test: 'test'
        },
        campaigns: {
          enable: process.env.DOO_CAMPAIGNS !== 'false'
        },
        facebook: {
          clientId: process.env.FACEBOOK_CLIENT_ID
        }
      }
    });
  };

}).call(this);
