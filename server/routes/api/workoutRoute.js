'use strict';

var workout = require('../../controllers/api/workoutController.js');

module.exports = function(app) {

  app.get('/api/workout/list', workout.list);
  app.get('/api/workout/now', workout.listNow);
  app.post('/api/workout/create', workout.create);
  app.post('/api/workout/createMessenger', workout.createMessenger);
  app.post('/api/workout/update/:id', workout.update);
  app.post('/api/workout/remove/:id', workout.delete);

};
