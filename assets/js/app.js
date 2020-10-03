/// Define SVG area dimensions ///
var svgWidth = 1000;
var svgHeight = 500;

/// Define chart's margins as an object ///
var margin = {
    top: 40,
    right: 70,
    bottom: 70,
    left: 40
}

/// Set chart area ///
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

/// Define attributes ///
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/// Append a group area, then set its margins ///
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


/// Load data from data.csv ///
d3.csv("assets/data/data.csv").then(function (csvdata) { 

  // Console Log entire data set
  console.log(csvdata);

  // Pick chart fields
  csvdata.forEach(function(data) {
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;
  });


  // Define axis attributes and create them with D3
  var x_scale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain(d3.extent(csvdata, data => data.poverty));

  var y_scale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(csvdata, data => data.obesity)]);

  var bottomAxis = d3.axisBottom(x_scale);
  var leftAxis = d3.axisLeft(y_scale);


  // Create axis labels
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity");

  chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
      .attr("class", "axisText")
      .text("Poverty");


  // Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);


  // ********************************************************************************
  // Step 8: Set up bubbles and append SVG path?
  // ********************************************************************************

  // Add dots
  var circlesGroup = chartGroup.selectAll("circle").data(csvdata).enter()

  circlesGroup.append('g')
      .selectAll("dot")
      .data(csvdata)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return xLinearScale(d.poverty); })
      .attr("cy", function (d) { return yLinearScale(d.obesity); })
      .attr("r", 13)
      // .attr("text-anchor", "middle").text(function (d) { return (d.abbr); })
      .style("fill", "#5e4a9e")
      .style("opacity", "0.7")

  circlesGroup
      .append("text")
      //We return the abbreviation to .text, which makes the text the abbreviation.
      .text(function (d) {
          return d.abbr;
      })
      //Now place the text using our scale.
      .attr("dx", function (d) {
          return xLinearScale(d['poverty']);
      })
      .attr("dy", function (d) {
          // When the size of the text is the radius, adding a third of the radius to the height pushes it into the middle of the circle.
          return yLinearScale(d['obesity']) + 10 / 2.5;
      })
      .attr("font-size", 13)
      .attr("class", "stateText")
})