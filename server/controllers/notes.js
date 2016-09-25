// var Note = require('../models/note.js');
var mongoose = require('mongoose');
var Note = mongoose.model('Note');

module.exports = (function(){
	return {
			add: function(req, res){
				var clean_name = req.body.name.trim().toLowerCase();
				var data_obj = { 
									name: clean_name,
									age: req.body.age,
									address: req.body.address,
									lat: req.body.lat,
									long: req.body.long,
									note: req.body.note,
									contact: req.body.contact,
								}
				var new_note = new Note(data_obj);
				new_note.save(function(err, data){
					res.redirect('/');
				});
			},
			get_by_id: function(req, res){
				Note.findOne({_id: req.params.id}, function(err, found_note){
					if(err){
						res.json('error!');
					}else{
						res.json(found_note);
					}
				});
			},
			add_reply: function(req, res){
				Note.findOne({_id: req.body.id}, function(err, found_note){
					if(err){
						res.json('error!');
					}else{	
						var reply = {
									   reply: req.body.reply,
									   contact: req.body.contact
									}
						found_note.replies.push(reply);
						found_note.timeout = Date.now;
						found_note.updated_at = Date.now;
						found_note.save(function(err, success){
							res.json(success);
						})
					}
				});
			},
			all: function(req, res){
				Note.find({}, function(err, notes){
					if(err){
						res.json(err);
					}else{
						res.render('sandbox', {notes: notes});
					}
				})
			},
			find_by_location: function(req, res){
				var finder_object = {
										lat: { 
												$gt: parseFloat(req.body.lat) - 0.1,
												$lt: parseFloat(req.body.lat) + 0.1
											 },
									    long: {
									    		$gt: parseFloat(req.body.long) - 0.1,
									    		$lt: parseFloat(req.body.long) + 0.1
									   		  }
									}
				Note.find(finder_object, function(err, results){
					console.log(results);
					res.json(results);
				})
			},
			find_by_name: function(req, res){
				if(req.body.name){
					var clean_name = req.body.name.trim().toLowerCase()
					Note.find({name: clean_name}, function(err, results){
						res.json(results);
					})
				}else{
					res.json('not a name');
				}
			}
	}
})()