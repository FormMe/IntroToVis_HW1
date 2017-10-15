
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

function cmp(_a, _b) {
		var aName = _a["name"], bName = _b["name"],
		isNum = (header == "gdp" || header == "life_expectancy" || header == "population" || header == "year" ),
			a = isNum ? parseFloat(_a[header]) : _a[header];
			b = isNum ? parseFloat(_b[header]) : _b[header];

		if(ascending) {
			if(header == "continent") {
	  			return d3.ascending(a, b) || d3.ascending(aName, bName);
			}
			else{
				return d3.ascending(a, b);
			}
		}
		else {
			if(header == "continent") {
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
	console.log(disp);
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
    d3.selectAll("input[type=checkbox]")
	  .on("change", function(){		
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();
	  });

	d3.selectAll('input[name="Aggregation"]')
	  .on("change", function(){
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();		
	  });

	d3.selectAll("input[type=range]")
	  .on("change", function () {
			update(aggregeate_data(filter_continents(exctract_year(data))));
			zebra_color();		    		
	  });
	  
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

	});



var categories= ['','Accessories', 'Audiophile', 'Camera & Photo', 'Cell Phones', 'Computers','eBook Readers','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];

		var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];

		var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

		var grid = d3.range(25).map(function(i){
			return {'x1':0,'y1':0,'x2':0,'y2':480};
		});

		var tickVals = grid.map(function(d,i){
			if(i>0){ return i*10; }
			else if(i===0){ return "100";}
		});

		var xscale = d3.scaleLinear()
						.domain([10,250])
						.range([0,722]);

		var yscale = d3.scaleLinear()
						.domain([0,categories.length])
						.range([0,480]);

		var colorScale = d3.scaleQuantize()
						.domain([0,categories.length])
						.range(colors);

		var canvas = d3.select('#BarChart')
						.append('svg')
						.attr('width',900)
						.attr('height',550);

		var grids = canvas.append('g')
						  .attr('id','grid')
						  .attr('transform','translate(150,10)')
						  .selectAll('line')
						  .data(grid)
						  .enter()
						  .append('line')
						  .attrs({'x1':function(d,i){ return i*30; },
								 'y1':function(d){ return d.y1; },
								 'x2':function(d,i){ return i*30; },
								 'y2':function(d){ return d.y2; },
							})
						  .style({'stroke':'#adadad','stroke-width':'1px'});

		/*var	xAxis = d3.svg.axis();
			xAxis
				.orient('bottom')
				.scale(xscale)
				.tickValues(tickVals);

		var	yAxis = d3.svg.axis();
			yAxis
				.orient('left')
				.scale(yscale)
				.tickSize(2)
				.tickFormat(function(d,i){ return categories[i]; })
				.tickValues(d3.range(17));*/

		var y_xis = canvas.append('g')
						  .attr("transform", "translate(150,0)")
						  .attr('id','yaxis')
						  .call(d3.axisLeft(yscale));

		var x_xis = canvas.append('g')
						  .attr("transform", "translate(150,480)")
						  .attr('id','xaxis')
						  .call(d3.axisBottom(xscale));

		var chart = canvas.append('g')
							.attr("transform", "translate(150,0)")
							.attr('id','bars')
							.selectAll('rect')
							.data(dollars)
							.enter()
							.append('rect')
							.attr('height',19)
							.text(function (d, i) { return categories[i]; })
							.attrs({'x':0,'y':function(d,i){ return yscale(i)+19; }})
							.style('fill',function(d,i){ return colorScale(i); })
							.attr('width',function(d){ return 0; });


		var transit = d3.select("svg").selectAll("rect")
						    .data(dollars)
						    .transition()
						    .duration(1000) 
						    .attr("width", function(d) {return xscale(d); });

		var transitext = d3.select('#bars')
							.selectAll('text')
							.data(dollars)
							.enter()
							.append('text')
							.attrs({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
							.text(function(d, i){ return categories[i] + d+"$"; })
							.style({'fill':'#fff','font-size':'14px'});

