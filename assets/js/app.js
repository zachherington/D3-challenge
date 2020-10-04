/// Define SVG area dimensions ///
var svgWidth = 1000;
var svgHeight = 500;

/// Define chart's margins as an object ///
var margin = {
    top: 40,
    right: 70,
    bottom: 40,
    left: 70
};

/// Set chart area ///
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

/// Define attributes ///
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/// Append a group area, then set its margins ///
var scatter_group = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


/// Load data from data.csv ///
d3.csv("assets/data/data.csv").then(function (csvdata) { 

  // Console Log entire data set
    console.log(csvdata);

  // Pick chart fields
    csvdata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });


  // Define axis attributes and create them with D3
    var x_scale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(csvdata, data => data.poverty));

    var y_scale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(csvdata, data => data.healthcare)]);

    var lower_axis = d3.axisBottom(x_scale);
    var left_axis = d3.axisLeft(y_scale);


  // Create axis labels
    scatter_group.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare");

    scatter_group.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("class", "axisText")
        .text("Poverty");


    // Add bottomAxis
    scatter_group.append("g").attr("transform", `translate(0, ${height})`).call(lower_axis);

    // Add leftAxis to the left side of the display
    scatter_group.append("g").call(left_axis);


  // Add markers
    var markers = scatter_group.selectAll("circle").data(csvdata).enter()

    markers.append('g')
        .selectAll("dot")
        .data(csvdata)
        .enter()
        .append("circle")
        .attr("cx", cx => x_scale(cx.poverty))
        .attr("cy", cy => y_scale(cy.healthcare))
        .attr("r", 13)
        .style("fill", "#5e4a9e")
        .style("opacity", "0.3")
        .style("stroke", "lightblue")

    markers.append("text")
        .text(t => t.abbr)

        // Assisn text location
        .attr("dx",dx => x_scale(dx['poverty']))
        .attr("dy", dy => y_scale(dy['healthcare']) + 4)
        .attr("font-size", 13)
        .attr("class", "stateText")
})