var margin = {top: 30, right: 50, bottom: 30, left: 50};

var svg = d3.select("svg");

width = window.innerWidth - margin.left - margin.right;
height = 700 - margin.top - margin.bottom;

margin_bottom = 100 + height;
margin_top = 50;

var xScale = d3.scaleLinear()
    .domain([0, width])
    .range([margin.left, width + margin.left]);

var yScale = d3.scaleLinear()
    .domain([0, height])
    .range([height + margin.top, margin.top]);

var rScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 100]);


var xAxis = d3.axisBottom(xScale).ticks(10);  		// Bottom = ticks below
var yAxis = d3.axisLeft(yScale).ticks(10);   // Left = ticks on the left 

function updateXScaleDomain(data) {
    xScale.domain([0, d3.max(data, function(d) { return d.v1; }) + 5]);
}

function updateYScaleDomain(data) {
    yScale.domain([0, d3.max(data, function(d) { return d.v2; }) + 5]);
}

function updateRScaleDomain(data) {
    rScale.domain([0, d3.max(data, function(d) { return d.v3; })]);
}

function updateDrawing(data) {
    var max_v1 = d3.max(data, function(d) { return d.v1; });
    var max_v2 = d3.max(data, function(d) { return d.v2; });
    var max_v3 = d3.max(data, function(d) { return d.v3; });

    // create svg and circles elements
    var svg = d3.select("svg");
    var circles = svg.selectAll("circle")
        .data(data)
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v3); })
        .attr("fill", function(d) { return d3.rgb(d.v1 * 255 / max_v1, d.v2 * 255 / max_v2, d.v3 * 255 / max_v3); });

    circles.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v3); })
        .attr("fill", function(d) { return d3.rgb(d.v1 * 255 / max_v1, d.v2 * 255 / max_v2, d.v3 * 255 / max_v3); });

    circles.exit().remove();
}

function drawAxes(data) {

    var svg = d3.select("svg");

    console.log(data[0]);

    margin_bottom = margin.bottom + height;
    // draw the x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + margin_bottom + ")")
        .on("click", function() {
            for (var i = 0; i < data.length; i++) {
                temp = data[i]["v1"];
                data[i]["v1"] = data[i]["v2"];
                data[i]["v2"] = temp;
                redraw(data);
            }
        })  
        .call(xAxis);

    // draw the y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .on("click", function() {
            for (var i = 0; i < data.length; i++) {
                temp = data[i]["v1"];
                data[i]["v1"] = data[i]["v3"];
                data[i]["v3"] = temp;
                redraw(data);
            }
        })
        .call(yAxis);
}

function redraw(data) {
    var svg = d3.select("svg");

    // transition for the change in axes
    var max_v1 = d3.max(data, function(d) { return d.v1; });
    var max_v2 = d3.max(data, function(d) { return d.v2; });
    var max_v3 = d3.max(data, function(d) { return d.v3; });

    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateRScaleDomain(data);
    
    var xAxis = d3.transition().duration(1000).select(".x.axis").call(d3.axisBottom(xScale).ticks(10));  		// Bottom = ticks below
    var yAxis = d3.transition().duration(1000).select(".y.axis").call(d3.axisLeft(yScale).ticks(10));   // Left = ticks on the left
    var rAxis = d3.transition().duration(1000).select(".r.axis").call(d3.axisLeft(rScale).ticks(10));   // Left = ticks on the left

    var circles = svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v3); })
        .attr("fill", function(d) { return d3.rgb(d.v1 * 255 / max_v1, d.v2 * 255 / max_v2, d.v3 * 255 / max_v3);});
}

d3.json("dataset/trivariate.json")
    .then(function(data) {
        updateXScaleDomain(data);
        updateYScaleDomain(data);
        updateRScaleDomain(data);
        drawAxes(data);
        updateDrawing(data);
    })
    .catch(function(error) {
        console.log(error);
    });