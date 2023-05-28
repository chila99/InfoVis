const margin = {top: 30, right: 50, bottom: 30, left: 50};

var svg = d3.select("svg");

const width = window.innerWidth - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

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

var current_x = "v1";
var current_y = "v2";
var current_r = "v3";

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
        .data(data);

    circles.enter().append("circle")
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v3); })
        .attr("fill", function(d) { return d3.rgb(d.v1 * 255 / max_v1, d.v2 * 255 / max_v2, d.v3 * 255 / max_v3); })
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .on("mouseover", function(d) {
            // get the circles coordinates, and add the value as text
            const r = d3.select(this).attr("r");
            const x = d3.select(this).attr("cx");
            const y = d3.select(this).attr("cy");

            svg.append("text")
            .attr("class", "value")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .text(parseFloat(r).toFixed(2));    
          })
          .on("mouseout", function() {
            // Remove v3 value and its background on mouseout
            svg.selectAll(".value, .value-background").remove();
            });
    circles.exit().remove();
}

function drawAxes(data) {

    var svg = d3.select("svg");
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
            }
            // sort the data by v3
            data.sort(function(a, b) {
                return -(a.v3 - b.v3);
            });
            temp = current_x;
            current_x = current_r;
            current_r = temp;
            redraw(data);
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
            }
            // sort the data by v3
            data.sort(function(a, b) {
                return -(a.v3 - b.v3);
            });
            temp = current_y;
            current_y = current_r;
            current_r = temp;
            console.log(current_y);
            redraw(data);
        })
        .call(yAxis);
        
    // add a label along the x-axis
    svg.append("text")
        .attr("class", "x label")
        .attr("y", margin_bottom - 15)
        .attr("x", width + margin.left - 15)
        .attr("font-size","15px")
        .style("text-anchor", "end")
        .text(current_x);

    // add a label along the y-axis
    svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -margin.top)
        .attr("font-size","15px")
        .style("text-anchor", "end")
        .text(current_y);        

}

function redraw(data) {
    var svg = d3.select("svg");
    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateRScaleDomain(data);
    
    d3.transition().duration(1000).select(".x.axis").call(d3.axisBottom(xScale).ticks(10));  		// Bottom = ticks below
    d3.transition().duration(1000).select(".y.axis").call(d3.axisLeft(yScale).ticks(10));   // Left = ticks on the left
    d3.transition().duration(1000).select(".r.axis").call(d3.axisLeft(rScale).ticks(10));   // Left = ticks on the left

    svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d.v1); })
        .attr("cy", function(d) { return yScale(d.v2); })
        .attr("r", function(d) { return rScale(d.v3); });

    // transition for the change in labels
    d3.transition().duration(1000).select(".x.label").text(current_x);
    d3.transition().duration(1000).select(".y.label").text(current_y);
}

d3.json("dataset/trivariate.json")
    .then(function(data) {
        // sort the data by v3
        data.sort(function(a, b) {
            return -(a.v3 - b.v3);
        });
        updateXScaleDomain(data);
        updateYScaleDomain(data);
        updateRScaleDomain(data);
        drawAxes(data);
        updateDrawing(data);
    })
    .catch(function(error) {
        console.log(error);
    });