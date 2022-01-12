Items = new Mongo.Collection('temperature_col');

// Allow all client-side updates on the Items collection
Items.allow({
  	insert() { return true; },
  	update() { return true; },
  	remove() { return true; },
});

Meteor.methods({
	
});