var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.right})`);

// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(trendData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(trendData, d => d[chosenXAxis]) * 0.9,
    d3.max(trendData, d => d[chosenXAxis]) * 1.1
  ])
  .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(trendData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(trendData, d => d[chosenYAxis])-2,
    d3.max(trendData, d => d[chosenYAxis])+1
  ])
  .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale,  newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}

// create function to render state abbr with transition - discussed with T.A.
function renderStates(textsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  textsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

    return textsGroup

}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, textsGroup) {

  var xlabel;

    if (chosenXAxis === "income") {
      xlabel = "Income:";
    } else if (chosenXAxis === "age") {
      xlabel = "Age (median)";
    } else {
        xlabel = "Poverty (%)";
    } 

  var ylabel;

    if (chosenYAxis === "healthcare") {
      ylabel = "% Lack Healthcare";
    } else if (chosenYAxis === "obesity") {
      ylabel = "Obesity %";
    } else {
      ylabel = "Smokes %";
    } 
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}<br>`);
    });

  textsGroup.call(toolTip);

  textsGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return textsGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(trendData) {

  console.log(trendData);
  // parse data
  trendData.forEach(function(data) {
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;

  });

  // xLinearScale & yLinearScale function above csv import
  var xLinearScale = xScale(trendData, chosenXAxis);
  var yLinearScale = yScale(trendData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(trendData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "16");

  var textsGroup = chartGroup.selectAll(null)
    .data(trendData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr);

  // Create group for axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);


  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") // value to grab for event listener
    .attr('class', 'aText')
    .classed("active", true)
    .text("Household Median Income");
  
  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .attr('class', 'aText')
    .classed("inactive", true)
    .text("In Poverty (%)");
 
  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .attr('class', 'aText')
    .classed("inactive", true)
    .text("Age (Median)");

  // Create group for y-axis labels
  var ylabelsGroup = chartGroup.append("g")

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y",0 - margin.left+60)
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")  
    .attr("class", "aText")
    .attr('transform', 'rotate(-90)')
    .classed("active", true)
    .text("% Lacks Healthcare");

  var smokesLabel = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left+40)
  .attr("x", 0 - (height / 2))
  .attr('value', 'smokes') // value to grab for the event listener
  .attr("dy", "1em")  
  .attr("class", "aText")
  .attr('transform', 'rotate(-90)')
  .classed('inactive', true)
  .text("Smokes (%)");

  var obesityLabel = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left+20)
  .attr("x", 0 - (height / 2))
  .attr('value', 'obesity')  //value to grab for the event listner
  .attr("dy", "1em")  
  .attr("class", "aText")
  .attr("transform", "rotate(-90)")
  .classed('inactive', true)
  .text("Obesity (%)");

  // updateToolTip function above csv import
  var textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);
  
    // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !=chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // update the x scale with the new data
        xLinearScale = xScale(trendData, chosenXAxis);      
        // update the x axis with transiton
        xAxis = renderXAxes(xLinearScale, xAxis);
        // update the circles with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // update the states with new values
        textsGroup = renderStates(textsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // update the tootips with new values
        textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);  
          ageLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else if (chosenXAxis === "poverty") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false); 
          ageLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true); 
          ageLabel
            .classed("active", true)
            .classed("inactive", false); 
        }
      }
    });
    
    // 12. create an event listeter for the y-axis labels
    ylabelsGroup.selectAll('text')
    .on('click', function (){
        //get value of the selection
        var value = d3.select(this).attr('value');
        if (value !=chosenYAxis) {
          // replace chosenXAxis with value
          chosenYAxis = value;
          // update the x scale with the new data
          yLinearScale = yScale(trendData, chosenYAxis);
          // update the x axis with transiton
          yAxis = renderYAxes(yLinearScale, yAxis);
          // update the circles with new values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
          // update the states with new values
          textsGroup = renderStates(textsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
          // update the tootips with new values
          textsGroup = updateToolTip(chosenXAxis, chosenYAxis, textsGroup);

          // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);  
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false); 
          obesityLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true); 
          obesityLabel
            .classed("active", true)
            .classed("inactive", false); 
        }
      }
  });

}).catch(function(error) {
  console.log(error)
});