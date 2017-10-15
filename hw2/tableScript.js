
var columnsToDisplay = ["name", "continent", "gdp", "life_expectancy", "population",  "year"]
var ascending = false;
var format_data = function(row){
	  return columnsToDisplay
	  		.map(function(column) {
				var formatComma = d3.format(","),
				formatDecimal = d3.format(".1f"), 
				formatSI = d3.formatPrefix('.1', 1e9);
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
    d3.select('tbody')
      .selectAll("tr.row")
      .style("background-color", 
             function(d, i){
                    return i%2 == 0 ? "#D8D8D8" : "white";
        });

}

 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_1995_2012.json", function(error, data){
    
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
			zebra_color();
      });
	
    var rows = tbody.selectAll("tr.row")
      .data(data)
	  .enter()
      .append("tr").attr("class", "row");


    var cells = rows.selectAll("td")
	.data(format_data)
      .enter()
      .append("td")
      .text(function(d) { return d;})
      .on("mouseover", function (d, i) {
            d3.select(this.parentNode)
                .style("background-color", "#ffb0bf");
        }).on("mouseout", function () {
        tbody.selectAll("tr")
            .style("background-color", null)
            .selectAll("td")
            .style("background-color", null)
	     zebra_color();
    });
	 
	update(aggregeate_data(filter_continents(exctract_year(data))));
	zebra_color();

	function update(new_data){
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
	 
	function filter_continents(_data) {		
  		var len = 0;
		var selectedContinents = [];
		d3.selectAll("input[type=checkbox]:checked")
		  .each(function(d){ len = selectedContinents.push(d3.select(this).property("value"));});	
		  
		return len == 0 
			? _data
			: _data.filter(function(d){return selectedContinents.includes(d.continent)});
	}

	function aggregeate_data(_data) {
		var AggType = d3.select('input[name="Aggregation"]:checked').node().value;
		return AggType == "None" 
			? _data
			: d3.nest()
			    .key(function(d) { return d.continent; })
			    .rollup(function(v) { 
			    	return {
						'name': v[0].continent,
						'continent': v[0].continent,
						'gdp': d3.sum(v, function(d) { return d.gdp; }), 
						'life_expectancy': d3.min(v, function(d) { return d.life_expectancy; }),
						'population': d3.sum(v, function(d) { return d.population; }),
						'year': v[0].year
					}}) 
		  		.entries(_data)
		  		.map(function (d) {return d.value; });
	}

	function exctract_year(_data) {
		var year = d3.select('input[type=range]').node().valueAsNumber;
		document.getElementById("year").innerHTML = year; 
		return _data.map(function (d) {
				yearItem = d["years"].find(function (item) { return item.year == year;});
				return {
					'name': d.name,
					'continent': d.continent,
					'gdp': yearItem.gdp, 
					'life_expectancy': yearItem.life_expectancy,
					'population': yearItem.population,
					'year': year
				};
		});
	}

	d3.selectAll("input[type=checkbox]")
	  .on("change", function(){		
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();
      });

    d3.selectAll("input[type=radio]")
	  .on("change", function(){
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();		
      });

    d3.selectAll("input[type=range]")
      .on("change", function () {
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();		    		
      })
	});