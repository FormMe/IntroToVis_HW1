/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

        this.treshold = false;
    }


	
	

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){
		/**
			 * Renders the HTML content for tool tip
			 *
			 * @param tooltip_data information that needs to be populated in the tool tip
			 * @return text HTML content for toop tip
			 */
			function tooltip_render (tooltip_data) {
			    let text = "<ul>";
			    tooltip_data.result.forEach((row)=>{
			        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
			    });

			    return text;
			}
					/**
			 * Returns the class that needs to be assigned to an element.
			 *
			 * @param party an ID for the party that is being referred to.
			 */
			function chooseClass(data) {
			    if (data == "R"){
			        return "republican";
			    }
			    else if (data == "D"){
			        return "democrat";
			    }
			    else if (data == "I"){
			        return "independent";
			    }
			}

	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */
	                return;
	            });

	            console.log(electionResult);
   			  // ******* TODO: PART III *******


   			 var parties = ['I', 'D', 'R']
   			 parties = parties.map(function (party) {
   			 			var perc = party + '_PopularPercentage';
   			 			var nominee = party + '_Nominee';
   			 			var votes = party + '_Votes_Total';
		   			 	return {
		   			 				'party': party,
		                            'percentage':  parseFloat(electionResult[0][perc].replace('%','')), 
		                            'nominee': electionResult[0][nominee], 
		                            'votes_total': electionResult[0][votes]
		                        }
   			 });
   			 if(parties[0].nominee == "")
   			 	parties.splice(0,1);

        	var svg = d3.select("#votes-percentage").select('svg');

        	var sum = d3.sum(parties, d => d['percentage']);
	        var width = this.svgWidth - 20;

	        var bias = 0;
	        var bars = svg.selectAll('rect')
	                      .data(parties);
	        bars.exit().remove();

	        bars = bars.enter()
	           .append('rect')
	           .merge(bars)
	           .attr('y', 50)
	           .attr('x', function (d) {
	           		var cur = bias;
	           		bias += d.percentage * width / sum;
	           	 	return cur;
	           })
	           .attr('height', 30)
	           .attr('width', d =>  d.percentage * width / sum)
	           .attr('class', function (d) {
	           	 return 'votesPercentage ' + chooseClass(d.party)
	           });

             var counts = svg.selectAll('.perc')
 	            .data(parties);
			  counts.exit().remove();
			  counts = counts.enter()
			     	.append('text')
			      .merge(counts)
			     	.attr("dy", "40")
						.attr("dx", function (d, i) {			
					        if(i == 0) return 0;
					        if(i == parties.length - 1){
					          return width;
					        }
					        else{
					            return (parties[i-1].percentage + d.percentage/2) * width / sum;
					        }
						})
						.attr('class', function (d) {
							return 'perc votesPercentageText ' + chooseClass(d.party);
						})
						.text(function(d) { return d.percentage + '%'; });
 

			  var nom = svg.selectAll('.nom')
				            .data(parties);

			  nom.exit().remove();
			  nom = nom.enter()
			     	.append('text')
			      .merge(nom)
			     	.attr("dy", "20")
						.attr("dx", function (d, i) {	
							console.log(d, i);		
					        if(i == 0) return 0;
					        if(i == parties.length - 1){
					          return width;
					        }
					        else{
					            return (parties[i-1].percentage + d.percentage/2)* width / sum;
					        }
						})
						.attr('class', function (d) {
							return 'nom votesPercentageText ' + chooseClass(d.party);
						})
						.text(function(d) { return d.nominee; });


		    if(!this.treshold){        
		        svg.append('text')
		            .attr("dy", "35")
		            .attr("dx", width/2)  
		            .attr('class', 'votesPercentageNote')
		            .text('Popular Vote (50%)');

		        svg.append('line')
		            .attr("x1", width/2)
		            .attr("x2", width/2)
		            .attr("y1", 40)
		            .attr("y2", 90)
		            .attr('stroke', 'black');

		        this.treshold = true;
		      }

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}