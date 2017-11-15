
 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_2012.json", function(error, data){

	d3.selectAll('input[name="Mode"]')
  	  .on("change", function(){
			var mode = d3.select('input[name="Mode"]:checked').node().value;

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
    console.log(data);
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

    function ranking_coords(rank){
    	var yScale;
    	if (rank !='No'){
			yScale = d3.scaleLinear()
				.range([height - 10, 0])
				.domain([d3.min(data, d => d[rank]), d3.max(data, d => d[rank])]);
		}
    	data.forEach(function (d, i) {
	  		d.y = rank =='No'? 5 + 2*i*nodeRadius
	  						 : 5 + yScale(d[rank]);	  		
    	})
  		
    }

    var update = function () {
		nodes.transition()
		  	.duration(500)
	      	.attr("transform", function(d, i) { 
			        return "translate("+ d.x + "," + d.y +")"; 
			      });  
    }

	ranking_coords('No');
    update();

    function ranking() {
		var Ranking = d3.select('input[name="Ranking"]:checked').node().value;
		if (Ranking == 'No') {
			ranking_coords('No');
		}
		else{
	  			var rank = d3.select("#Rank").node().value; 
			ranking_coords(rank);	
		}
		update();
    }

	d3.selectAll('input[name="Ranking"]')
  	  .on("change", function(){
			ranking();
	});
	d3.selectAll('#Rank')
  	  .on("change", function(){
			ranking();
	});
});