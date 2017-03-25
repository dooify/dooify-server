// Generated by CoffeeScript 1.12.4
(function() {
  var FaceCommunicator, clientId, clientSecret, face, https;

  https = require('https');

  clientId = process.env.FACEBOOK_CLIENT_ID;

  clientSecret = process.env.FACEBOOK_CLIENT_SECRET;

  module.exports = FaceCommunicator = face = {
    call: function(path, args, cb) {
      var k, qs, v;
      qs = [];
      for (k in args) {
        v = args[k];
        qs.push((encodeURIComponent(k)) + "=" + (encodeURIComponent(v)));
      }
      path = path + "?" + (qs.join('&'));
      return https.get({
        host: 'graph.facebook.com',
        path: path
      }, function(res) {
        var data;
        data = '';
        res.on('data', function(chunk) {
          return data += chunk;
        });
        return res.on('end', function() {
          data = JSON.parse(data);
          return cb(data);
        });
      });
    },
    exchangeCodeForToken: function(arg, cb) {
      var args, redirectUrl;
      args = arg.args, redirectUrl = arg.redirectUrl;
      args = {
        client_id: clientId,
        redirect_uri: redirectUrl,
        client_secret: clientSecret,
        code: args.code
      };
      return face.call("/v2.3/oauth/access_token", args, function(data) {
        if (data.access_token == null) {
          return cb({
            error: 'token error',
            description: 'The login process was interrupted, please try again. Extra info: ' + JSON.stringify(data)
          });
        } else {
          return cb({
            token: data.access_token
          });
        }
      });
    },
    exchangeTokenForFbUserid: function(arg, cb) {
      var args, token;
      token = arg.token;
      args = {
        input_token: token,
        access_token: clientId + "|" + clientSecret
      };
      return face.call("/debug_token", args, function(answer) {
        if (!(answer && (answer.data != null))) {
          return cb({
            error: {
              id: 'facebook failed',
              description: answer
            }
          });
        } else if (!answer.data.is_valid) {
          return cb({
            error: {
              id: 'bad user',
              description: answer.data
            }
          });
        } else {
          return cb({
            fbUserId: answer.data.user_id,
            fbUser: answer.data
          });
        }
      });
    },
    getFacebookProfile: function(arg, cb) {
      var args, fbUserId, token;
      fbUserId = arg.fbUserId, token = arg.token;
      args = {
        access_token: token,
        fields: 'id,email,first_name,last_name,picture'
      };
      console.log("/v2.6/" + fbUserId, JSON.stringify(args));
      return face.call("/v2.6/" + fbUserId, args, function(answer) {
        if (!(answer && (answer.id != null))) {
          return cb({
            error: 'fetch profile failed',
            description: answer
          });
        } else {
          return cb({
            fbProfile: answer
          });
        }
      });
    }
  };

}).call(this);