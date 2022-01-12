Template.Temperature.onCreated(function() {
	this.autorun(function() {
		this.subscription = Meteor.subscribe('all-items-pub');
	}.bind(this));
});

Template.Temperature.onRendered(function() {
	$('body').append('<script type="text/javascript" src="/js/d3-6-7.js"></script>');

	this.subscribe('all-items-pub', function() {
		var dataY = Items.find({}, {sort: {date: -1}, limit: 100}).fetch();
		//console.log(dataY[0].samples[0]);
		var myData = dataY[0].samples;

		if(myData) {
			// set the dimensions and margins of the graph
			var margin = {top: 10, right: 10, bottom: 10, left: 10},
		  	width = 500 - margin.left - margin.right,
		  	height = 500 - margin.top - margin.bottom; 

			// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
			var radius = Math.min(width, height) / 2 - margin.top;

			// append the svg object to the div called 'target_area'
			var svg = d3.select("#target_area")
				.append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var color = d3.scaleOrdinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

			var arc = d3.arc()
			.innerRadius(0)
			.outerRadius(radius);

			var pie = d3.pie()
			.sort(null)
			.value(function (d) {
			    return d.temperature;
			});

			var g = svg.selectAll(".arc")
		    .data(pie(myData))
		    .enter().append("g")
		    .attr("class", "arc");

		    g.append("path")
		    .attr("d", arc)
		    .style("fill", function (d) {
		        return color(d.data.timestamp);
		    });

		    g.append("svg:title")
		    .text(function (d) {
		    	return d.data.timestamp + ": " + d.temperature;
			});

			g.append("text")
		    .attr("transform", function (d) {
		    	return "translate(" + arc.centroid(d) + ")";
			})
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .text(function (d) {
		    	return d.data.timestamp;
			});
		}
	});
});

Template.Temperature.helpers({
	Items() {
		var items = Items.find({}, {sort: {date: -1}, limit: 100}).fetch();
		if(items[0]) {
			return items[0].samples;
		}
	},
});