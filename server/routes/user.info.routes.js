'use strict';

// Load the module dependencies
var profile = require('../controllers/user.info.controller.js');

// Define the routes module' method
module.exports = function(app) {

  app.get('/profile', profile.render);
  app.post('/profile/update', profile.update);

  app.get('/forgot', profile.forgot);
  app.post('/forgot', profile.reset);

  app.get('/reset/:token', profile.token);
  app.post('/reset/:token', profile.change);

};
