// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Set chart, append svg elements and set attributes of width and height
// Overall canvas
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

// Since we are dealing with numeric data; create linear scale
function xScale(poverty_rate_Data, chosenXAxis) {
    // create scales
    console.log(poverty_rate_Data);
    console.log(d3.max(poverty_rate_Data, d => parseFloat(d[chosenXAxis])) * 1.1);
    console.log(d3.min(poverty_rate_Data, d => parseFloat(d[chosenXAxis])) * 0.9);

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(poverty_rate_Data, d => parseFloat(d[chosenXAxis])) * 0.9,
        d3.max(poverty_rate_Data, d => parseFloat(d[chosenXAxis])) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

//function renderAxes(newXScale, xAxis) {
    //var bottomAxis = d3.axisBottom(newXScale);
  
//     xAxis.transition()
//       .duration(1000)
//       .call(bottomAxis);
  
//     return xAxis;
// }

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(p_data, err) {
    if (err) throw err;
  
    // parse data
    // p_data.forEach(function(data) {
    //   p_data.poverty = +p_data.poverty;
    //   p_data.healthcare = +p_data.healthcare;
    //   p_data.abbr = +p_data.abbr;
    // });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(p_data, "poverty");
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([3, d3.max(p_data, d => d.healthcare)*3.0])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(p_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d["poverty"]))
      .attr("cy", d => yLinearScale(d["healthcare"]))
      .attr("r", 20)
      .attr("fill", "red")
      .attr("opacity", ".5")
      .attr("class", d => d.abbr);
    
    circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("class","state_abbreviation")
      .attr("dx", d => xLinearScale(d["poverty"]))
      .attr("dy", d => yLinearScale(d["healthcare"]));

      

  
    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var poverty_label = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty Rate (%)");
  
    // var albumsLabel = labelsGroup.append("text")
    //   .attr("x", 0)
    //   .attr("y", 40)
    //   .attr("value", "num_albums") // value to grab for event listener
    //   .classed("inactive", true)
    //   .text("# of Albums Released");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Healthcare Rate (%)");
  
    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    // labelsGroup.selectAll("text")
    //   .on("click", function() {
    //     // get value of selection
    //     var value = d3.select(this).attr("value");
    //     if (value !== chosenXAxis) {
  
    //       // replaces chosenXAxis with value
    //       chosenXAxis = value;
  
    //       // console.log(chosenXAxis)
  
    //       // functions here found above csv import
    //       // updates x scale for new data
    //       xLinearScale = xScale(hairData, chosenXAxis);
  
    //       // updates x axis with transition
    //       xAxis = renderAxes(xLinearScale, xAxis);
  
    //       // updates circles with new x values
    //       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
    //       // updates tooltips with new info
    //       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    //       // changes classes to change bold text
    //       if (chosenXAxis === "num_albums") {
    //         albumsLabel
    //           .classed("active", true)
    //           .classed("inactive", false);
    //         hairLengthLabel
    //           .classed("active", false)
    //           .classed("inactive", true);
    //       }
    //       else {
    //         albumsLabel
    //           .classed("active", false)
    //           .classed("inactive", true);
    //         hairLengthLabel
    //           .classed("active", true)
    //           .classed("inactive", false);
    //       }
    //     }
    //   });
  
  
    }).catch(function(error) {
    console.log(error);
  });

