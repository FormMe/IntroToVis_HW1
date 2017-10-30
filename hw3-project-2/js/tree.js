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
      /*  var flatData = [
  {"name": "Top Level", "parent": null, 'lol': 5}, 
  {"name": "Level 2: A", "parent": 0, 'lol': 5 },
  {"name": "Level 2: B", "parent": 0, 'lol': 5 },
  {"name": "Son of A", "parent": 1, 'lol': 5 },
  {"name": "Daughter of A", "parent": 1, 'lol': 5 },
  {"name": "ssss", "parent": 4, 'lol': 5 }
];*/

// convert the flat data into a hierarchy 
var treeData = d3.stratify()
  .id(function(d,i) { return i; })
  .parentId(function(d) { return d.ParentGame; })
  (flatData);
 
console.log(treeData);


// set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()
    .size([height, width]);

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
  });

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });

// adds the circle to the node
node.append("circle")
  .attr("r", 10);

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("x", function(d) { return d.children ? -13 : 13; })
  .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
  .text(function(d) { return d.data.name; });
    
        // ******* TODO: PART VI *******
        //Create a tree and give it a size() of 800 by 300. 
       /* var tree = d3.tree()
                     .size([800, 300]);

        //Create a root for the tree using d3.stratify(); 
        var treeD = d3.stratify()
          .id(function(d) { return d.Team; })
          .parentId(function(d) { return d.ParentGame; })
          (treeData);

        
        //Add nodes and links to the tree. 
        var nodes = d3.hierarchy(treeD, function(d) {
            return d.children;
          });
        nodes = tree(nodes);*/
       
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
