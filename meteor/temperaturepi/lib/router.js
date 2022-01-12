Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', function() {
	this.render('Temperature');
}, {
	name: 'home'
});