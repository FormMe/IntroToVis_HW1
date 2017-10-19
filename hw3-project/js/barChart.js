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
        console.log(this.allData);
    	var width = 500, height = 400, paddingLeft = 65;

		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(newData, function(d) { return d.value; })]);

		var x = d3.scaleBand()
			.range([width, paddingLeft])
			.padding(0.1)
			.domain(newData.map(function(d) { return d.year; }));

        var color = d3.scaleLinear()
        		.domain([1,newData.lenght])
	      		.interpolate(d3.interpolateHcl)
	      		.range([d3.rgb("#007AFF"), d3.rgb('#be6bf4')]);

    	color = d3.scaleSequential(d3["interpolatePuBu"])
    			  .domain([d3.min(newData, function(d) { return d.value; }),
    			   d3.max(newData, function(d) { return d.value; })]);

        var appending = d3.select('#bars')
        	.selectAll('rect')
	       	.data(newData);
	    appending.exit().remove();

	    // add new elements
	   appending = appending.enter()
	    	.append('rect')
	    	.merge(appending)
	    	.transition()
	        .duration(1000)
	        .style("fill", function(d,i){return color(d.value);})
	        .attr("y", function(d) { return y(d.value); })
	        .attr("x", function(d) { return x(d.year); })
	        .attr("height",function (d) {return height - y(d.value); })
	        .attr("width",x.bandwidth());

	    d3.select('#xAxis')
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x))
			.selectAll("text")
			    .attr("y", 0)
			    .attr("x", 9)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(90)")
			    .style("text-anchor", "start");

	    d3.select('#yAxis')
	    	.transition()
	        .duration(1000)
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        .attr("transform", "translate("+paddingLeft+",0)")
	        .call(d3.axisLeft(y));


        // ******* TODO: PART II *******
        d3.select('#bars')
          .selectAll('rect')
          .on("click", function (d, i) {
          	
        console.log(this.allData);
          	d3.select('#bars')
          	  .selectAll('rect')
          	  .style("fill", function(d){return color(d.value);});
          	d3.select(this)
          	  .style("fill", "red");

          	//var worldcupData = this.allData.find(function (d) { return d.year === [i].year; });
          	console.log(this.allData);
          	//this.worldMap.updateMap(worldcupData);
          	//this.infoPanel.updateInfo(worldcupData);

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