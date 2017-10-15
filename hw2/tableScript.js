
var columnsToDisplay = ["name", "continent", "gdp", "life_expectancy", "population",  "year"]
var ascending = false;
var format_data = function(row){
	  return columnsToDisplay
	  		.map(function(column) {
				var formatComma = d3.format(","),
				formatDecimal = d3.format(".1f"), 
				formatSI = d3.format(".3s");
				if(column == "gdp"){
					return formatSI(row[column]);
				}
				if(column == "life_expectancy"){
					return formatDecimal(row[column]);
				}
				if(column == "population"){
					return formatComma(row[column]);
				}
	  			return row[column]; 
	  		})
	  	};

 function zebra_color () {
	d3.select('tbody').selectAll("tr.row")
        .selectAll('td')
        .on("mouseover", function (d, i) {

            d3.select(this.parentNode)
                .style("background-color", "#ffb0bf");

        }).on("mouseout", function () {
        tbody.selectAll("tr")
            .style("background-color", null)
            .selectAll("td")
            .style("background-color", null)
	    d3.select('tbody')
	      .selectAll("tr:nth-child(odd)")
	      .style("background-color", "#D8D8D8");
    });
}

 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_2012.json", function(error, data){
    
    var table = d3.select("body").append("table"),
      thead = table.append("thead")
                   .attr("class", "thead");
      tbody = table.append("tbody");

    table.append("caption")
      .html("World Countries Ranking");

    thead.append("tr").selectAll("th")
      .data(columnsToDisplay)
    .enter()
      .append("th")
      .text(function(d) { return d;})
      .on("click", function(header, i) {
        tbody.selectAll("tr")
			 .sort(function(a, b) {
					  return d3.descending(a[header], b[header]) || d3.ascending(a["name"], b["name"]);
					});
      });
	
    var rows = tbody.selectAll("tr.row")
      .data(data)
	  .enter()
      .append("tr").attr("class", "row");


    var cells = rows.selectAll("td")
	.data(format_data)
      .enter()
      .append("td")
      .text(function(d) { return d;});
	 
	zebra_color();

	var update = function(new_data){
	    var new_rows = tbody.selectAll('tr.row').data(new_data);
	    new_rows
	        .exit()
	        .remove();
	    new_rows = new_rows
	        .enter()
	        .append("tr").attr("class", "row").merge(new_rows);

	    var n_cells = new_rows
	        .selectAll('td')
	        .data(format_data);

	    n_cells.exit()
	        .remove();
	    n_cells = n_cells
	        .enter()
	        .append('td');

	    var temp = tbody.selectAll('td').data();

	    tbody.selectAll('td')
	    .text(function (d) { return d; })
	}; 
	 
	d3.selectAll("input[type=checkbox]")
	  .on("change", function(){
			var selectedContinents = [];
			d3.selectAll("input:checked")
			  .each(function(d){ selectedContinents.push(d3.select(this).property("name"));});	
			var filtered_data = 
				selectedContinents.lenght == 0 
				? data
				: data.filter(function(d){return selectedContinents.includes(d.continent)});
			
			update(filtered_data);
			
      });

      d3.selectAll("input[type=radio]")
	  .on("change", function(){
			var AggType;
			d3.selectAll('input[name="agregation"]:checked')
			  .each(function(d){ AggType = d3.select(this).property("value");});	
			var agg_data = 
				AggType.lenght == "None" 
				? data
				: data.filter(function(d){return selectedContinents.includes(d.continent)});
			
			update(filtered_data);
			
      });
	  
	  
			/*rows.exit().remove();
			  
			tbody.selectAll("tr")
			 .style("display", function(d){
				if(selectedContinents.lenght == 0)
					return "table-row"; 
				return selectedContinents.includes(d.continent)? "table-row" : "none"; })
		     .style("background-color", 
			 function(d, i){
					return i%2 == 0 ? "#D8D8D8" : "white";
			 });  */
			  
			  
			/*console.log(selectedContinents.lenght == 0, selectedContinents.lenght );					
			
			
			
			selectAll(row).data(newData).each().enter().exit()
			
			rows.data(filtered_data)
			.enter()
			.append("tr").attr("class", "row")
			.style("background-color", 
					 function(d, i){
							return i%2 == 0 ? "#D8D8D8" : "white";
					 });
					 
			cells.data(function(row) {	return format(row); })
			  .enter()
			  .append("td")
			  .text(function(d) { return d; })
			  .on("mouseover", function(d, i) {

				d3.select(this.parentNode)
				  .style("background-color", "#F3ED86");
			
			  }).on("mouseout", function() {

				tbody.selectAll("tr")
				  .style("background-color", function(d, i){
								return i%2 == 0 ? "#D8D8D8" : "white";
						})
				  .selectAll("td")
				  .style("background-color", null);
		
				});	*/
		
	});