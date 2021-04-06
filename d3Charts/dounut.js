/* Dount Chart*/

function drawDounutChart(Chartwidth, Chartheight,Container,dataObj) {
	/* -------- Draw SVG in chart2 container -------- */
	var svg = d3.select(Container)
		.append("svg")
		.attr("width", Chartwidth)
		.attr("height", Chartheight)
		.append("g")
	/* -------- Append SVG -------- */
	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "labels");
	svg.append("g")
		.attr("class", "lines");

	var formatSum = d3.format(".0s");
	/* -------- Set Width Height Radius -------- */
	var width = Chartwidth,
		height = Chartheight,
		radius = Math.min(width, height) / 2;
	/* -------- Create Pie and Arc -------- */
	var pie = d3.layout.pie()
		.sort(null)
		.value(function (d) {
			return d.emissions;
		});

	var arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.6);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var key = function (d) { return d.data.sector; };

	/* ----- color scale (there are six sectors to highlight) ----- */
	var colorScale = d3.scale.ordinal()
		.range(["ForestGreen", "DarkSeaGreen", "Gainsboro", "MediumSeaGreen", "DarkGreen", "Black"]);

	var label = svg.append("text")
		.attr("class", "label");

	Draw(dataObj); 
	/* -------- Read File -------- */
	function Draw(dataObj) {
		/* --------  Convert string into interger values -------- */
		var data  = [];
		data.push({"sector": 'FieldGoals', "emissions": +dataObj["FG"]});
		data.push({"sector": 'ThreePointsGoal', "emissions": +dataObj["3P"]});
		data.push({"sector": 'TwoPointsGoal', "emissions": +dataObj["2P"]});
		
		/* ------- Pie Slices -------*/
		var slice = svg.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function (d) { return colorScale(d.data.sector); })
			.attr("class", "slice");

		slice
			.transition().duration(1000)
			.attrTween("d", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					return arc(interpolate(t));
				};
			})

		slice.exit()
			.remove();

		/* ------- Text Labels -------*/
		var text = svg.select(".labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function (d) { return d.data.sector; });


		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = (radius - 35) * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate(" + pos + ")";
				};
			})
			.styleTween("text-anchor", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start" : "end";
				};
			});

		text.exit()
			.remove();

		/* ------- Slice to text ploylines -------*/

		var polyline = svg.select(".lines").selectAll("polyline")
			.data(pie(data), key);

		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.85 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

		polyline.exit()
			.remove();
	};
}