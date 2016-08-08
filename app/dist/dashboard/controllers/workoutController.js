var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var WorkoutController = (function () {
            function WorkoutController($mdDialog, userService, selected) {
                this.$mdDialog = $mdDialog;
                this.userService = userService;
                this.selected = selected;
                this.response = "";
                this.days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
                this.selectedDays = [];
                this.author = this.userService.get();
                if (this.author.role == "coach") {
                    this.author = this.author.id;
                    this.assignee = this.userService.selectedUser;
                    this.assignee = this.assignee._id;
                }
                else if (this.author.role == "user") {
                    this.author = this.author.id;
                    this.assignee = this.author;
                }
                if (selected) {
                    this._id = selected._id,
                        this.selectedDays = selected.selectedDates,
                        this.reminder = selected.title,
                        this.responses = selected.responses,
                        this.time = new Date(selected.timeOfDay);
                }
            }
            // selectedDays reminder
            WorkoutController.prototype.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1)
                    list.splice(idx, 1);
                else
                    list.push(item);
            };
            ;
            WorkoutController.prototype.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
            ;
            WorkoutController.prototype.toggleAll = function () {
                if (this.selectedDays.length === this.days.length) {
                    this.selectedDays = [];
                }
                else if (this.selectedDays.length === 0 || this.selectedDays.length > 0) {
                    this.selectedDays = this.days.slice(0);
                }
            };
            ;
            WorkoutController.prototype.isChecked = function () {
                return this.selectedDays.length === this.days.length;
            };
            ;
            WorkoutController.prototype.isIndeterminate = function () {
                return (this.selectedDays.length !== 0 &&
                    this.selectedDays.length !== this.days.length);
            };
            ;
            WorkoutController.prototype.select = function () {
            };
            WorkoutController.prototype.close = function () {
                this.$mdDialog.cancel();
            };
            WorkoutController.prototype.save = function () {
                //console.log("r" + this.selected);
                //console.log("hello select: " +this.selected.responses);
                console.log(this.time);
                var dates = {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false
                };

                var days = [];
                var hour = this.time.getHours();
                var minute = this.time.getMinutes();


                if (this.selectedDays.indexOf('Sun') != -1) {
                    dates.sunday = true;
                    days.splice(this.days.length,0,0);
                }
                if (this.selectedDays.indexOf('Mon') != -1) {
                    dates.monday = true;
                    days.splice(this.days.length,0,1);
                }
                if (this.selectedDays.indexOf('Tues') != -1) {
                    dates.tuesday = true;
                    days.splice(this.days.length,0,2);
                }
                if (this.selectedDays.indexOf('Wed') != -1) {
                    dates.wednesday = true;
                    days.splice(this.days.length,0,3);
                }
                if (this.selectedDays.indexOf('Thurs') != -1) {
                    dates.thursday = true;
                    days.splice(this.days.length,0,4);
                }
                if (this.selectedDays.indexOf('Fri') != -1) {
                    dates.friday = true;
                    days.splice(this.days.length,0,5);
                }
                if (this.selectedDays.indexOf('Sat') != -1) {
                    dates.saturday = true;
                    days.splice(this.days.length,0,6);
                }
                var workout = {
                    _id: this._id,
                    title: this.workout,
                    days: days,

                    // Will this be set to server time or user's local time?
                    //toLocaleTimeString(),
                    timeOfDay: this.time,
                    hour: hour,
                    minute: minute,
                    selectedDates: this.selectedDays,
                    daysOfTheWeek: dates,
                    author: this.author,
                    assignee: this.assignee,
                    responses: this.responses

                };

                console.log('check time');
                console.log(workout.timeOfDay);
                console.log('check assingee');
                console.log(workout);
                //console.log(reminder);
                this.$mdDialog.hide(workout);
            };
            WorkoutController.$inject = ['$mdDialog', 'userService', 'selected'];
            return WorkoutController;
        }());
        dashboard.WorkoutController = WorkoutController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=reminderController.js.map
