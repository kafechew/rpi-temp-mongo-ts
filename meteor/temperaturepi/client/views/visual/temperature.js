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
		var dataset = dataY[0].samples;

		const yAccessor = (d) => d.temperature;
		//const dateParser = d3.timeParse("%a %b %d %Y %H:%M:%S %Z");
		const xAccessor = (d) => d.timestamp;

		//console.log(xAccessor(dataset[0]));

		let dimensions = {
		    width: window.innerWidth * 0.5,
		    height: 600,
		    margin: {
		      	top: 115,
		      	right: 20,
		      	bottom: 40,
		      	left: 60,
		    },
		};

		dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
		dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

		const wrapper = d3
		.select("#wrapper")
    	.append("svg")
    	.attr("width", dimensions.width)
    	.attr("height", dimensions.height);

    	const bounds = wrapper
    	.append("g")
    	.style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    	const yScale = d3
	    .scaleLinear()
	    .domain(d3.extent(dataset, yAccessor))
	    .range([dimensions.boundedHeight, 0]);

	    const referenceBandPlacement = yScale(100);
		const referenceBand = bounds
		.append("rect")
		.attr("x", 0)
		.attr("width", dimensions.boundedWidth)
		.attr("y", referenceBandPlacement)
		.attr("height", dimensions.boundedHeight - referenceBandPlacement)
		.attr("fill", "#ffece6");

		const xScale = d3
	    .scaleTime()
	    .domain(d3.extent(dataset, xAccessor))
	    .range([0, dimensions.boundedWidth]);

	    const lineGenerator = d3
	    .line()
	    .x((d) => xScale(xAccessor(d)))
	    .y((d) => yScale(yAccessor(d)))
	    .curve(d3.curveBasis);

	    const line = bounds
	    .append("path")
	    .attr("d", lineGenerator(dataset))
	    .attr("fill", "none")
	    .attr("stroke", "Red")
	    .attr("stroke-width", 2);

	    const yAxisGenerator = d3.axisLeft().scale(yScale);
  		const yAxis = bounds.append("g").call(yAxisGenerator);

  		const xAxisGenerator = d3.axisBottom().scale(xScale);
  		const xAxis = bounds
	    .append("g")
    	.call(xAxisGenerator.tickFormat(d3.timeFormat("%b,%y")))
    	.style("transform", `translateY(${dimensions.boundedHeight}px)`);

    	wrapper
	    .append("g")
	    .style("transform", `translate(${50}px,${15}px)`)
	    .append("text")
	    .attr("class", "title")
	    .attr("x", dimensions.width / 2)
	    .attr("y", dimensions.margin.top / 2)
	    .attr("text-anchor", "middle")
	    //.text("Temperature ")
	    .style("font-size", "36px")
	    .style("text-decoration", "underline");
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