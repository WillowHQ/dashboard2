'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user.js');

var workoutSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  start: {type: Date, default: Date.now},
  timeOfDay: {
    type: Date, default: Date.now
    },
  selectedDates: [String],
  daysOfTheWeek: {
    monday: {type: Boolean},
    tuesday: {type: Boolean},
    wednesday: {type: Boolean},
    thursday: {type: Boolean},
    friday: {type: Boolean},
    saturday: {type: Boolean},
    sunday: {type: Boolean}
  },

   // Who the workout is coming from
  days: [{type: Number, min: 0, max: 6}],
  hour: {type: Number, min: 0, max: 23},
  minute: {type: Number, min:0, max:59},
  // Owner of the object, which models

  // Which Messaging service will the workout use
  delivery: {
    id: {type: String},
    platform: {
      type: String,
      enum: ['facebook', 'slack', 'text']
    }
  },
  // Who the workout is going too
  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // Who the workout is coming from
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

  needsResponse: {type: Boolean, default: false}
});

workoutSchema.virtual('mostRecentResponse').get(function() {
	return this.responses[this.responses.length - 1];
});

workoutSchema.statics.makeDefaultworkout = function () {
    var workout = new workout();
    workout.save(function (err) {
        if (err) return err;
    })
    return workout;

};
workoutSchema.method.response = function(){
  console.log('can I get a hello');
  return 'hello';
};

// We want to decrement if the last response
workoutSchema.methods.decrement = function() {

  var currentResponse = this.responses[this.responses.length - 1];
  var lastNonResponse = this.lastNonResponse();

  if(currentResponse.responded === false) {
    var currentDate = moment(currentResponse.timStamp);
    var lastNonResponseDate = moment(lastNonResponse.timeStamp);

    if(currentDate.subtract(1, 'days').isSameOrBefore(lastNonResponseDate))
      return true;
    else
      return false;
  }
  else{
    return false;
  }

}

workoutSchema.methods.lastGenuine = function() {
  for(var i = this.responses.length - 1; i >= 0; i--) {
    if(this.responses[i].responded) {
      return this.responses[i].timeStamp;
    }
  }
}

workoutSchema.methods.lastNonResponse = function() {
  for(var i = this.responses.length - 1; i >= 0; i--) {
    if(!this.responses[i].responded) {
      return this.responses[i].timeStamp;
    }
  }
}

workoutSchema.post('findOneAndUpdate', function(doc) {
  console.log('reminde updated');
  console.log(doc);

});

workoutSchema.methods.parseDates = function() {

  this.days = [];
  if(this.daysOfTheWeek.sunday){
      this.days.splice(this.days.length,0,0);
  };
  if(this.daysOfTheWeek.monday){
      this.days.splice(this.days.length,0,1);
  };
  if(this.daysOfTheWeek.tuesday){
      this.days.splice(this.days.length,0,2);
  };
  if(this.daysOfTheWeek.wednesday){
      this.days.splice(this.days.length,0,3);
  };
  if(this.daysOfTheWeek.thursday){
      this.days.splice(this.days.length,0,4);
  };
  if(this.daysOfTheWeek.friday){
      this.days.splice(this.days.length,0,5);
  };
  if(this.daysOfTheWeek.saturday){
      this.days.splice(this.days.length,0,6);
  };

  this.hour = this.timeOfDay.getHours();
  this.minute = this.timeOfDay.getMinutes();

};

var workout = mongoose.model('workout', workoutSchema);

//lets make making workouts a piece of cake !

//create a static method to make a default workouts object

module.exports = workout;
