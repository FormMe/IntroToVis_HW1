/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice();

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';


        /** Setup the scales*/
        this.goalWidht = 200;
        this.goalScale = d3.scaleLinear()
                            .range([10, this.goalWidht-10])
                            .domain([0, 18]);

        /** Used for games/wins/losses*/
        this.gameScale = 10; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, 7])
                                     .range(['#ece2f0', '#016450']);
        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        d3.select('#goalHeader')
            .append('svg')
            .attr('width', this.goalWidht)
            .attr('height', 35)
            .append('g')
            .attr("transform", "translate(0," + 25 + ")")
            .call(d3.axisTop(this.goalScale));

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        var tbody = d3.select('#matchTable').select('tbody');
        var rows = tbody.selectAll('tr')
                        .data(this.tableElements);
        rows.exit()
            .remove();
        rows = rows
            .enter()
            .append("tr").merge(rows);

        var cells = rows
            .selectAll('td')
            .data(function (d) {
                console.log(d);
                return [{'type': 'aggregate', 'vis': 'text', 'value': d['key']},
                        {'type': 'aggregate', 'vis': 'goals', 'value': [d['value']['Goals Made'],d['value']['Goals Conceded']] },
                        {'type': 'aggregate', 'vis': 'text', 'value': d['value']['Result']['label']},
                        {'type': 'aggregate', 'vis': 'bar', 'value': d['value']['Wins']},
                        {'type': 'aggregate', 'vis': 'bar', 'value': d['value']['Losses']},
                        {'type': 'aggregate', 'vis': 'bar', 'value': d['value']['TotalGames']}
                ];
            });

        cells.exit()
             .remove();
        cells = cells
            .enter()
            .append('td');

        var bar_cells = cells.filter(function (d) {
            return d.vis == 'bar';
        }).append('svg')
          .attrs(this.cell);

        var cs = this.aggregateColorScale;
        var gs = this.gameScale;
        bar_cells.append('rect')
            .style('fill', function (d) { return cs(d.value); })
            .attr('width', function (d) { return d.value*gs;})
            .attr('height', this.bar.height);

        bar_cells.append('text')
            .style('fill', 'white')
            .attr('x', function (d) { return d.value*gs - gs;})            
            .attr('y', this.bar.height - gs/2)
            .text(function (d) { return d.value;})

        var text_cells = cells.filter(function (d) {
            return d.vis == 'text';
        })
            .text(d => d.value);


        var goals_cell = cells.filter(function (d) {
            return d.vis == 'goals';
        })
            .append('svg')
            .attr('width', this.goalWidht)
            .attr('height', 20);

        goals_cell.append('rect')
            .attr('class', 'goalBar')
            .attr('x', d => this.goalScale(Math.min(d.value[0], d.value[1])))    
            .attr('y', this.bar.height - gs)
            .attr('width', d => this.goalScale(Math.max(d.value[0], d.value[1]) - Math.min(d.value[0], d.value[1]) - 1))
            .attr('height', 16)
            .attr('fill', function (d) {
                return d.value[0] > d.value[1] ? 'steelblue' : '#be2714';
            });

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]))
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('fill', 'steelblue');

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]))
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('fill', '#be2714');

        //Create table rows

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
