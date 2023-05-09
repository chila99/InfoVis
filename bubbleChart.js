// import datas from trivariate.json 
var margin = {top: 20, right: 20, bottom: 30, left: 40};

width = 800 - margin.left - margin.right;
height = 300 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "svg");

d3.json("trivariate.json")
    .then(function(data) {
        updateDrawing(data);
    })
    .catch(function(error) {
        console.log(error);
    });

function updateDrawing(data) {
    // create svg and circles elements
    var svg = d3.select("svg");
    var circles = svg.selectAll("circle")
        .data(data)
        .attr("cx", function(d) { return d.v1; })
        .attr("cy", function(d) { return d.v2; })
        .attr("r", function(d) { return d.v3; });

    circles.enter().append("circle")
        .attr("cx", function(d) { return d.v1; })
        .attr("cy", function(d) { return d.v2; })
        .attr("r", function(d) { return d.v3; })
        .attr("fill", function(d) { return "red"; });

    circles.exit().remove();
}