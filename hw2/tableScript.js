
var columnsToDisplay = ["name", "continent", "gdp", "life_expectancy", "population",  "year"]
var ascending = false;
var format_data = function(row){
	  return columnsToDisplay
	  		.map(function(column) {
				var formatComma = d3.format(","),
				formatDecimal = d3.format(".1f"), 
				formatSI = d3.format('.3s');
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

function update_table(new_data){
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

    tbody.selectAll('td')
    .text(function (d) { return d; })
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

var sortHeader = null;
function cmp(_a, _b) {
		var aName = _a["name"], bName = _b["name"],
			isNum = (sortHeader == "gdp" || sortHeader == "life_expectancy" || sortHeader == "population" || sortHeader == "year" ),
			a = isNum ? parseFloat(_a[sortHeader]) : _a[sortHeader];
			b = isNum ? parseFloat(_b[sortHeader]) : _b[sortHeader];

		if(ascending) {
			if(sortHeader == "continent") {
	  			return d3.ascending(a, b) || d3.ascending(aName, bName);
			}
			else{
				return d3.ascending(a, b);
			}
		}
		else {
			if(sortHeader == "continent") {
	  			return d3.descending(a, b) || d3.ascending(aName, bName);
			}
			else {
				return d3.descending(a, b);
			}
		}
}


d3.selectAll('input[name="Display"]')
  .on("change", function(){
	var disp = d3.select('input[name="Display"]:checked').node().value;
	if (disp == "Table") {
		d3.select("#Table")
		.style("display", "block");
		d3.select("#BarChart")
		.style("display", "none");
		d3.selectAll('#Encode')
		.style("display", "none");
		d3.selectAll('#Sort')
		.style("display", "none");
	}
	else if (disp == "BarChart"){
		d3.select("#Table")
		.style("display", "none");
		d3.select("#BarChart")
		.style("display", "block");
		d3.selectAll('#Encode')
		.style("display", "block");
		d3.selectAll('#Sort')
		.style("display", "block");
	}

  });

 d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_1995_2012.json", function(error, data){

    var table = d3.select("body").append("table").attr("id", "Table"),
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
      	sortHeader = header;
 		ascending = !ascending;
        tbody.selectAll("tr")
			 .sort(function (a, b) { return cmp(a, b);});
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
      .text(function(d) { return d;});
	
	var data_bar = aggregeate_data(filter_continents(exctract_year(data)));
	update_table(data_bar);
	zebra_color();

	/*Bar Chart*/

	function update_bar_chart(new_data) {
	    //var new_rows = tbody.selectAll('tr.row').data(new_data);
	    var new_bars = svg.selectAll(".bar").data(new_data)
	    //new_rows
	    //    .exit()
	    //    .remove();
	    new_bars
	        .exit()
	        .remove();
	    //new_rows = new_rows
	    //    .enter()
	    //    .append("tr").attr("class", "row").merge(new_rows);

	    new_bars = new_bars
	    	.enter()
	    	.append("g").merge(new_bars);

	    //var n_cells = new_rows
	    //    .selectAll('td')
	    //    .data(format_data);

	    var new_rects = new_bars
	    	.attr("class", "bar")
        	.attr("y", function (d) {
            	return y(d.name);
	        })
	        .attr("height", y.bandwidth())
	        .attr("x", 0)
	        .attr("width", function (d) {
	            return x(d.population);
	        });

	    new_rects.exit().remove();

	    //n_cells.exit()
	    //    .remove();
	    new_rects = new_rects
	        .enter()
	        .append('rect');

	    //tbody.selectAll('td')
	    //.text(function (d) { return d; })
	}

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 5,
        right: 25,
        bottom: 55,
        left: 180
    };

    var width =  600 - margin.left - margin.right,
        height = data_bar.length * 11 - margin.top - margin.bottom;
    console.log(height);
    var svg = d3.select("#BarChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data_bar, function (d) {
            return d.population;
        })]);

    var y = d3.scaleBand()
    	.rangeRound([0, height])
        .domain(data_bar.map(function (d) {
            return d.name;
        }));

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))

    var bars = svg.selectAll(".bar")
        .data(data_bar)
        .enter()
        .append("g")
        .style("fill", function(d, i){
        	var colors = {
        		'Americas': "blue",
        		'Africa': "yellow",
        		'Oceania': "red",
        		'Asia': "green",
        		'Europe': "brown"
        	};
        	return colors[d.continent];
        });

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.population);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.population) + 3;
        });

	 function display(data){
		var disp_data = aggregeate_data(filter_continents(exctract_year(data)));
		update_table(disp_data);
        tbody.selectAll("tr")
			 .sort(function (a, b) { return cmp(a, b);});
		zebra_color();		    		
		//update_bar_chart(disp_data)
	  }
    d3.selectAll("input[type=checkbox]")
	  .on("change", function () { display(data); });

	d3.selectAll('input[name="Aggregation"]')
	  .on("change", function () { display(data); });

	d3.selectAll("input[type=range]")
	  .on("change", function () { display(data); });
 });

