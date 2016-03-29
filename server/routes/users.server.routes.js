'use strict';

// Load the module dependencies
var users    = require('../controllers/users.server.controller'),
	  passport = require('passport'),
		request = require('request'),
		_ = require('underscore');
// Define the routes module' method
module.exports = function(app) {
	// Set up the 'signup' routes
	app.route('/signup')
	   .get(users.renderSignup)
	   .post(users.signup);

	// Set up the 'signin' routes
	app.route('/signin')
	   .get(users.renderSignin)
	   .post(function(req,res,next) {
			 passport.authenticate('local', function(err, user, info) {
	    		if (err) {
						return next(err);
					}
	    		if (!user) {
						return res.redirect('/signin');
					}
			    req.logIn(user, function(err) {
			      if (err) {
							console.log('err');
							console.log(err);
							return next(err);
						}
						else {

							// Setup Slack API call
							var slack = [];

							var headers = {
							    'User-Agent':       'Super Agent/0.0.1',
							    'Content-Type':     'application/x-www-form-urlencoded'
							}

							var options = {
							    url: 'https://slack.com/api/users.list',
							    method: 'GET',
							    headers: headers,
							    qs:	{
										'token': 'xoxp-21143396339-21148553634-24144454581-f6d7e3347d',
									}
							}

							request(options, function (error, response, body) {
									console.log('request is here');
							    if (!error && response.statusCode == 200) {
							        	var members = JSON.parse(body).members;
											_.forEach(members, function(member) {
												if(!member.is_bot && !member.deleted){
				                  slack.push({
				                    team: member.team_id,
				                    id: member.id,
				                    name: member.name,
				                    real_name: member.real_name,
				                    email: member.profile.email,
				                    img: member.profile.image_72,
				                    timezone: member.tz
				                  });
												}
											});

											_.forEach(slack, function(member) {
												console.log('hello');
												request.post('http://localhost:3000/generate',{
													form: {
															user: req.user,
															client: {
																coach: req.user.id,
																username: member.email,
																slack: member
															}
														}
												}, function(err,httpResponse,body){
													if(err) {
														//console.log(err);
													}
													else {
														console.log(body);
													}
												})
											})

							    }
							});
						}
			      return res.redirect('/');
			    });
				})(req,res,next);
		});

	app.post('/generate', users.generateUser);
		// function(req,res) {
		// 	res.redirect(req.session.returnTo || '/');
		// 	delete req.session.returnTo;
		// }

	// Set up the Facebook OAuth routes
	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/signin',
		scope: ['email']
	}));
	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Twitter OAuth routes
	app.get('/oauth/twitter', passport.authenticate('twitter', {
		failureRedirect: '/signin'
	}));
	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Google OAuth routes
	app.get('/oauth/google', passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		],
		failureRedirect: '/signin'
	}));
	app.get('/oauth/google/callback', passport.authenticate('google', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the 'signout' route
	app.get('/signout', users.signout);

	app.get('/users', users.find);

};
