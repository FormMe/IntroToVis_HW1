/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

    	let newData = this.allData.map(function (d) {
    		return {'year': d.year, 'value': d[selectedDimension] };
    	});
    	console.log(newData);
    	var width = 500, height = 400;

    	var x = d3.scaleBand().rangeRound([0, width]);
		var y = d3.scaleLinear().range([height, 0]);
 		x.domain(newData.map(function(d) { return d.year; }));
  		y.domain([0, d3.max(newData, function(d) { return d.value; })]);


		var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
 		x.domain(newData.map(function(d) { return d.year; }));


        var color = d3.scaleLinear()
        		.domain([1,newData.lenght])
	      		.interpolate(d3.interpolateHcl)
	      		.range([d3.rgb("#007AFF"), d3.rgb('#be6bf4')]);

/*
	    var chart = d3.select('#barChart');
	    var groups = chart.selectAll('g')
	    		.remove().exit()
	    		.data(newData);

        var appending = groups.enter()
        			.append('g')
        groups.exit().remove();
        groups = groups.merge(appending);*/


        var appending = d3.select('#bars')
        	.selectAll('rect')
	       	.data(newData);
	    appending.exit().remove();
	    console.log(appending);
	    // add new elements
	    appending.enter()
	    	.append('rect')
	    	.transition()
	        .duration(500)
	        .style("fill", function(d,i){return color(d.value);})
	        .attr("y", function(d) { console.log(d.value); return y(d.value); })
	        .attr("x", function(d) { return x(d.year); })
	        .attr("height",function (d) {return height - y(d.value); })
	        .attr("width",x.bandwidth());

	    // remove old elements
	    appending.exit().remove();

	    // add the x Axis
	    d3.select('#xAxis')
	    	.attr("y", height)
	    	.append("g")
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        //attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x));

	    // add the y Axis
	    d3.select('#yAxis')
	    	.append("g")
	    	.transition()
	        .duration(500)
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        .call(d3.axisLeft(y));
        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




        // ******* TODO: PART II *******
        d3.select('#bars')
          .selectAll('rect')
          .on("click", function (d, i) {
          	d3.select('#bars')
          	  .selectAll('rect')
          	  .style("fill", function(d,i){return color(d.value);});
          	d3.select(this)
          	  .style("fill", "red");
          	
          })
        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}