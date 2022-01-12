Template.Temperature.onCreated(function() {
	this.autorun(function() {
		this.subscription = Meteor.subscribe('all-items-pub');
	}.bind(this));
});

Template.Temperature.onRendered(function() {
	//$('body').append('<script type="text/javascript" src="/js/d3.js"></script>');
	
});

Template.Temperature.helpers({
	Items() {
		var items = Items.find({}, {sort: {date: -1}, limit: 100}).fetch();
		if(items[0]) {
			return items[0].samples;
		}
	},
});