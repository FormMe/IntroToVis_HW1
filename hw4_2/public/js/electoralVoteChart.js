   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */



    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
	    function chooseClass (party) {
	        if (party == "R"){
	            return "republican";
	        }
	        else if (party == "D"){
	            return "democrat";
	        }
	        else if (party == "I"){
	            return "independent";
	        }
	    }
          // ******* TODO: PART II *******
          var Gdata = d3.nest()
                .key(function(d) { return d['State_Winner']; })
                .rollup(function(v) { 
                    return v.map(function (state) {
                        return {
                                'State_Winner': state['State_Winner'],
                                'Total_EV': state['Total_EV'],
                                'RD_Difference': state['RD_Difference']
                            }
                        }
                    ).sort(function (a, b) { return a['RD_Difference'] - b['RD_Difference']; })
                }) 
                .entries(electionResult);

        var data = [];
        Gdata.forEach(function (states) {
            data = data.concat(states.value);
        });



        var xAxis = d3.scaleLinear()
            .rangeRound([10, this.svgWidth - 10]);
        
        var svg = d3.select("#electoral-vote").select('svg');


        var bias = 0;
        var width = this.svgWidth - 20;
        svg.selectAll('rect')
           .data(data)
           .enter()
           .append('rect')
           .attr('y', 50)
           .attr('x', function (d) {
           		var cur = bias;
           		bias += xAxis(d.Total_EV)/width;
           	 	return cur;
           })
           .attr('height', 30)
           .attr('width', d => xAxis(d.Total_EV)/width)
           .attr('class', 'electoralVotes')
           .attr('fill', d => colorScale(d.RD_Difference));
        console.log(Gdata, data);


        var ev = Gdata.map(function (p) {
        	return {
        		'party': p.key,
        		'ev_count': d3.sum(p.value, s => s['Total_EV'])
        	}
        } );

        svg.selectAll('text')
           	.data(ev)
           	.enter()
           	.append('text')
           	.attr("dy", "90")
			.attr("dx", function (d) {
				console.log(d);
				return xAxis(d.ev_count)/width;
			})
			.attr('class', function (d) {
				return 'electoralVoteText ' + chooseClass(d.party);
			})
			.text(function(d) { return d.ev_count; });

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    };

    
}
