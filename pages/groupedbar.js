

function update(){
    var margin = {top: 70, right: 20, bottom: 150, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format("%Y-%m").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    //.tickFormat(d3.time.format("%Y-%m"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select(".schart").append("svg").attr("id", "csvg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("PlayersTotals.csv", function(error, data) {

        data.forEach(function(d) {
            d["G"] = +d["G"];
            d["FG"] = +d["FG"]
            d["FGA"] = +d["FGA"];
            d["BLK"] = +d["BLK"]
            d["STL"] = +d["STL"]
        });
        var checked = d3.select('input[name="mode"]:checked').node().value;
        data.sort(function(a, b){return b[checked]-a[checked]});
        var fdata = data.slice(0,20)
        console.log(fdata)
      x.domain(fdata.map(function(d) { return d.Player; }));
      y.domain([0, d3.max(data, function(d) { return d[checked]; })]);
    
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-75)" );
    
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
    
      svg.selectAll("bar")
          .data(data)
        .enter().append("rect")
          .style("fill", "steelblue")
          .attr("x", function(d) { return x(d.Player); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d[checked]); })
          .attr("height", function(d) { return height - y(d[checked]); });
    
    });
    

}
update()
d3.select(".controls").on("change", function(){
    d3.select("#csvg").remove();
    update()
})