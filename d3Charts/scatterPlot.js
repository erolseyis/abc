
function drawScaterChart(Chartwidth,Chartheight,XLabel) {
/* -------- Set margin and height width -------- */ 
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = Chartwidth - margin.left - margin.right,
    height = Chartheight - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

/* --------  Setup x -------- */
var xValue = function(d) { return d[XLabel];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0).tickPadding(10);

/* --------  Setup y -------- */
var yValue = function(d) { return d.TransferValue;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0).tickPadding(10);

/* --------  setup fill color -------- */
  var cValue = function (d) { return d["Player"];},
    color = d3.scale.ordinal()
      .range(["ForestGreen", "DarkSeaGreen", "Gainsboro", "MediumSeaGreen", "DarkGreen", "Black"])
      .domain([0, 50])
      .range(["green","red","yellow","blue","pink"]);

/* --------  Add the graph canvas to the body of the webpage -------- */
var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------  Add the tooltip area to the webpage -------- */
var tooltip = d3.select("#chart1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/* --------  load data -------- */
d3.csv("data/PlayersTotals.csv", function(error, data) {

    
/* --------  Change string (from CSV) into number format -------- */
  data.forEach(function(d) {
    d[XLabel] = +d[XLabel];
    d.TransferValue = +d["G"];
  });
    
  var average = d3.mean(data.map(function (d) { return d[XLabel]}));
  /* --------  don't want dots overlapping axis, so add in buffer to data domain -------- */
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  /* --------  X-axis -------- */
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(XLabel);

  /* --------  Y-axis -------- */
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
    .text("Goals");

  /* --------  Draw dots -------- */
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return +d["G"]*.1;}) 
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          d3.selectAll(".dot").style("opacity", function(d) {
            return 0.5;});
          d3.select(this).style("opacity", 1);
          /* --------  Show Tooltip -------- */
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
                tooltip.html(d["Player"]  +
                             "<br/> Team : " + d["Tm"] + "<br/>"
                             + " Goals :" + d["G"] )
               .style("left", (d3.event.screenX - 300) + "px")
               .style("top", (d3.event.screenY - 328) + "px");
                
      })
    .on("click", function (d) {
      d3.select("#chart2").html("");
      drawDounutChart(600,360,"#chart2",d);
    })
      .on("mouseout", function(d) {
      /* --------  Hide Tooltip -------- */
        d3.selectAll(".dot").style("opacity", function(d) {return 1;});
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
       /* --------  Call Horizontal Stacked bar Stop highlight Function -------- */
        stophighlight();
      });

});
}