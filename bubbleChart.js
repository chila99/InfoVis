var margin = {top: 30, right: 50, bottom: 30, left: 50};

var svg = d3.select("svg");

width = window.innerWidth - margin.left - margin.right;
height = 500 - margin.top - margin.bottom;

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

function drawAxes() {

    var svg = d3.select("svg");

    margin_bottom = margin.bottom + height;
    // draw the x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + margin_bottom + ")")
        .on("click", function() {
            console.log("click on x axis");
            switchXR();
        })  
        .call(xAxis);

    // draw the y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .on("click", function() {
            // newXscale = xScale.copy();
            console.log("click on y axis");
            switchYR();
        })
        .call(yAxis);
}

function switchXR(n) {
    domainCopy = xScale.domain();
    xScale.domain(rScale.domain());
    rScale.domain(domainCopy);


    var svg = d3.select("svg");
    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale).ticks(10));

    var circles = svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d.v3); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v1); });
}

function switchYR() {
    domainCopy = yScale.domain();
    yScale.domain(rScale.domain());
    rScale.domain(domainCopy);

    var svg = d3.select("svg");
    var circles = svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v3); })
        .attr("r", function(d) { return rScale(d.v2); });

    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale).ticks(10));
}

d3.json("dataset/trivariate.json")
    .then(function(data) {
        console.log(data);
        updateXScaleDomain(data);
        updateYScaleDomain(data);
        updateRScaleDomain(data);
        drawAxes();
        updateDrawing(data);
    })
    .catch(function(error) {
        console.log(error);
    });