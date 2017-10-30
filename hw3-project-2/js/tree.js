/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(flatData) {
        // ******* TODO: PART VI *******

        var treeData = d3.stratify()
          .id(function(d,i) { return i; })
          .parentId(function(d) { return d.ParentGame; })
          (flatData);
         
        treeData.each(function(d) {
            d.name = d.data.Team;
          });


        var treemap = d3.tree()
            .size([800, 300]);

        //  assigns the data to a hierarchy using parent-child relationships
        var nodes = d3.hierarchy(treeData, function(d) {
            return d.children;
          });

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var g = d3.select('#tree')
                  .attr("transform", "translate(100,0)");

        // adds the links between the nodes
        var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
          .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
               return "M" + d.y + "," + d.x
                 + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                 + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                 + " " + d.parent.y + "," + d.parent.x;
               });

        // adds each node as a group
        var node = g.selectAll(".node")
            .data(nodes.descendants())
          .enter().append("g")
            .attr("class", function(d) { 
                return (d.data.data.Wins == "0" ? "node" : 'winner') + 
                (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) { 
              return "translate(" + d.y + "," + d.x + ")"; });

        // adds the circle to the node
        node.append("circle")
          .attr("r", 5);

        // adds the text to the node
        node.append("text")
          .attr("dy", ".35em")
          .attr("x", function(d) { return d.children ? -13 : 13; })
          .style("text-anchor", function(d) { 
            return d.children ? "end" : "start"; })
          .text(function(d) { return d.data.name; });
    
       
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
    }
}
