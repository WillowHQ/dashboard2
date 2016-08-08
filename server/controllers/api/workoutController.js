'use strict';

var workout = require('../../models/workout.js');
var User = require('../../models/user.js');

exports.create = function(req, res) {
  var workout = new workout(req.body);
  console.log("workout controller hit");
  //console.log(workout);
  workout.save(function(err, workout){
    if(err) {
      console.log(err);
      res.status(500);


    } else {
      console.log("workout Good");
      res.send(workout)
    }
  });
};

exports.createMessenger = function(req, res) {
  Messengerworkout.create(req.body);
}

exports.read = function(req, res) {

};

//from http://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
exports.update = function(req, res) {
  console.log('Updating workout');
  console.log();
  ////console.log(req.body);
  workout.findOneAndUpdate({'_id': req.body._id},
  {
    title: req.body.title,
    timeOfDay: req.body.timeOfDay,
    days: req.body.days,
    hour: req.body.hour,
    minute: req.body.minute,
    seletedDates: req.body.selectedDates,
    daysOfTheWeek: req.body.daysOfTheWeek,
    author: req.body.author,
    assignee: req.body.assignee
  }, {new: true}, function (err, workout) {
    if (!err) {
      console.log('workout updated: ' + workout);
      res.send(workout);
    } else {
      res.status(500);
      res.send(err);
    }
  });
}

exports.delete = function(req, res) {
  console.log();
  console.log('Inside workout.delete');
  console.log('id: ' + req.params.id);
  workout.findByIdAndRemove(
    req.params.id,
    function(err, workout) {
      if(err){
        console.log(err);
        res.sendStatus(500);
      }
      else{
        console.log(workout);
        res.sendStatus(200);
      }
    }
  );
}

exports.listNow = function(req,res) {

   var now = new Date();
   var hoursNow = now.getHours();
   var minutesNow = now.getMinutes();
   var dayNow = now.getDay();

   workout.find({days: dayNow})
           .where('hour').equals(hoursNow)
           .where('minute').equals(minutesNow)
           .populate('assignee')
           .populate('slack')
           .exec(function(err, docs){
             console.log(docs);
             console.log('exec workout/now');
             if(docs){
               res.json(docs);
             }
             else {
               winston.error(err);
             }
           });
}

exports.list = function(req, res) {
  workout.find({}, function(err, obj) {
    res.json(obj);
  })
}
