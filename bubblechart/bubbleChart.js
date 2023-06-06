const margin = {top: 80, right: 50, bottom: 80, left: 50};

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
const variables = ["v1", "v2", "v3"];

function updateXScaleDomain(data) {
    xScale.domain([0, d3.max(data, function(d) { return d[current_x]; }) + 5]);
}

function updateYScaleDomain(data) {
    yScale.domain([0, d3.max(data, function(d) { return d[current_y]; }) + 5]);
}

function updateRScaleDomain(data) {
    rScale.domain([0, d3.max(data, function(d) { return d[current_r]; })]);
}

function updateDrawing(data) {
    // sort the data
    data.sort(function(a, b) {
        return b[current_r] - a[current_r];
    });
    // update the max values
    var max_x = d3.max(data, function(d) { return d[current_x]; });
    var max_y = d3.max(data, function(d) { return d[current_y]; });
    var max_r = d3.max(data, function(d) { return d[current_r]; });

    // create svg and circles elements
    var svg = d3.select("svg");
    var circles = svg.selectAll("circle")
        .data(data);

    circles.enter().append("circle")
        .attr("cx", function(d) { return xScale(d[current_x]); })
        .attr("cy", function(d) { return yScale(d[current_y]); })
        .attr("r", function(d) { return rScale(d[current_r]); })
        .attr("fill", function(d) { return d3.rgb(d[current_x] / max_x * 255, d[current_y] / max_y * 255, d[current_r] / max_r * 255); })
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .on("mouseover", function(d) {
            // Ottieni le coordinate del cerchio e i valori delle variabili
            const x = d3.select(this).attr("cx");
            const y = d3.select(this).attr("cy");

            // Ottieni i dati associati al circle
            var circleData = d3.select(d.target).data()[0];

            // Aggiungi il rettangolo del tooltip
            svg.append("rect")
                .attr("class", "tooltip-background")
                .attr("x", x - 50)
                .attr("y", y - 80)
                .attr("width", 100)
                .attr("height", 70)
                .attr("stroke", "black")
                .attr("stroke-width", 2)

            for (var i = 0; i < variables.length; i++ ){
                svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", x)
                    .attr("y", y - 55 + 15 * i)
                    .attr("text-anchor", "middle")
                    .text(variables[i] + " : " + circleData[variables[i]]);
            }
        })
        .on("mouseout", function() {
            // Rimuovi il tooltip quando il mouse esce dal cerchio
            svg.selectAll(".tooltip, .tooltip-background").remove();
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
            temp = current_y;
            current_y = current_r;
            current_r = temp;
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
    
    svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d[current_x]); })
        .attr("cy", function(d) { return yScale(d[current_y]); })
        .attr("r", function(d) { return rScale(d[current_r]); })

    // transition for the change in labels
    d3.transition().duration(1000).select(".x.label").text(current_x);
    d3.transition().duration(1000).select(".y.label").text(current_y);
}

d3.json("../dataset/trivariate.json")
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