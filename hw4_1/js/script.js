
 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_2012.json", function(error, data){

 	function layout_mode() {
 		var mode = d3.select('input[name="Mode"]:checked').node().value;
			d3.selectAll('div')
			  .style("display", "none")
			d3.select("#" + mode)
			.style("display", "block");
			switch(mode){
				case 'R': ranking_layout(); break;
				case 'S': scatter_layout(); break;
			}
 	}

	d3.selectAll('input[name="Mode"]')
  	  .on("change", function(){
			layout_mode();
	});

	var margin = {top: 50, bottom: 10, left: 300, right: 40};
	var width = 900 - margin.left - margin.right;
	var height = 1500 - margin.top - margin.bottom;
	var nodeRadius = 5; 
	var svg = d3.select("#plot")
	            .attr("width", width)
	            .attr("height", height);

    data.forEach(function (d, i) {
    	d.x = 10; d.y = 0;
    })

	var nodes = svg.selectAll('.node')
	              .data(data)
	            .enter()
	              .append("g")
	              .attr("class", "node");

	nodes.append("circle")
	    .attr("r", nodeRadius) 

    nodes.append("text")
        .attr("dy", "3")
        .attr("dx", "7")
        .attr('font-family', 'sans-serif') 
        .attr('font-size', '10px')
        .text(function(d) { return d.name; });

  
    function ranking_layout() {
		var Ranking = d3.select('input[name="Ranking"]:checked').node().value;
		var rank = (Ranking == 'No') ? 'No' : d3.select("#Rank").node().value; 
		var yScale;
		if (Ranking != 'No')
			yScale = d3.scaleLinear()
				.range([height - 15, 5])
				.domain([d3.min(data, d => d[rank]), d3.max(data, d => d[rank])]);
		
		data.forEach(function (d, i) {
	    		d.x = 10;
		  		d.y = rank =='No'? 5 + 2*i*nodeRadius
		  						 : 5 + yScale(d[rank]);	  		
	    	})
		update();
    }
    function scatter_layout(){
    	var mode = d3.select('input[name="Coordinates"]:checked').node().value;
    	var xAxis = mode == 'lon/lat' ? 'longitude': 'population';
    	var yAxis = mode == 'lon/lat' ? 'latitude': 'gdp';
    	var xScale = d3.scaleLinear()
				.range([10, width-40])
				.domain([d3.min(data, d => d[xAxis]),
						 d3.max(data, d => d[xAxis])]);

    	var yScale = d3.scaleLinear()
				.range([10, height-10])
				.domain([d3.min(data, d => d[yAxis]),
						 d3.max(data, d => d[yAxis])]);

    	data.forEach(function (d, i) {
	  		d.x = xScale(d[xAxis]);	  	
	  		d.y = yScale(d[yAxis]);	  	
    	});  		
		update();
    }

    function update() {
		nodes.transition()
		  	.duration(500)
	      	.attr("transform", function(d, i) { 
			        return "translate("+ d.x + "," + d.y +")"; 
			      });  
    }



	layout_mode();

	d3.selectAll('input[name="Ranking"]')
  	  .on("change", function(){
			ranking_layout();
	});
	d3.selectAll('#Rank')
  	  .on("change", function(){
			ranking_layout();
	});
	d3.selectAll('input[name="Coordinates"]')
  	  .on("change", function(){
  	  		scatter_layout();
	});
});