
 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_2012.json", function(error, data){

	var margin = {top: 50, bottom: 10, left: 300, right: 40};
	var width = 900 - margin.left - margin.right;
	var height = 1500 - margin.top - margin.bottom;
	var nodeRadius = 5; 
	var svg = d3.select("#first")
	            .attr("width", width)
	            .attr("height", height);
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


    var update = function (rank) {
		nodes.transition()
		  	.duration(500)
	      	.attr("transform", function(d, i) { 
		      		var y;
		      		if(rank =='No') {
		      			y = 5 + 2*i*nodeRadius;
		      		}
		      		else {	      			
						var yScale = d3.scaleLinear()
							.range([height - 10, 0])
							.domain([d3.min(data, d => d[rank]), d3.max(data, d => d[rank])]);
		      			y = 5 + yScale(d[rank]);
		      		}
			        return "translate(10,"+ y +")"; 
			      });  
    }

    update('No');

	d3.selectAll('input[name="Ranking"]')
  	  .on("change", function(){
			var Ranking = d3.select('input[name="Ranking"]:checked').node().value;
			if (Ranking == 'No') {
				update('No');
			}
			else{
  	  			var rank = d3.select("#Rank").node().value; 
				update(rank);	
			}
	});
	d3.selectAll('#Rank')
  	  .on("change", function(){
			var Ranking = d3.select('input[name="Ranking"]:checked').node().value;
			if (Ranking == 'No') {
				update('No');
			}
			else{
  	  			var rank = d3.select("#Rank").node().value; 
				update(rank);	
			}
	});
});