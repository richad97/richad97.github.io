let formatNumber = d3.format(",.0f");

let margin = { top: -5, right: 0, bottom: 0, left: 0 },
  width = 250 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

let svg = d3
  .select("#piechart-col")
  .append("svg")
  .attr("id", "piechart-svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let radius = width / 3;

let arc = d3.arc().innerRadius(0).outerRadius(radius);

let labelNameArc = d3.arc().innerRadius(130).outerRadius(radius);

let color = d3.scaleOrdinal([
  "#5E5D5E",
  "#7C7C7C",
  "#9B9B9B",
  "#C7C7C7",
  "#FFFFFF",
]);

function wrap(text) {
  text.each(function (d) {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      lineNumber = 0,
      lineHeight = 1.1;
    // null out text
    text.text(null);
    // loop the words
    while ((word = words.pop())) {
      // build tspan
      var tspan = text
        .append("tspan")
        .attr("dy", ++lineNumber * lineHeight + "em")
        .text(word);
      // adjust position based on angle
      if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
        tspan.attr("x", 5);
      } else {
        tspan.attr("x", 5);
      }
      if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
        tspan.attr("y", -20);
      } else {
        tspan.attr("y", -20);
      }
    }
  });
}

export function pieChart(data, str, date) {
  let arr = [];

  data.forEach((elem) => {
    let mostRecent = +elem[date];
    let country = elem[str];

    window.obj = {
      Daily: mostRecent,
      Country: country,
    };

    arr.push(obj);
  });

  let newSet = arr.sort((a, b) => (a.Daily > b.Daily ? -1 : 1)).slice(0, 5);

  function update() {
    let pie = d3
      .pie()
      .value(function (d) {
        return d.Daily;
      })
      .padAngle(0.0);
    let path = svg.selectAll("path").data(pie(newSet));
    let labelName = svg.selectAll(".labels").data(pie(newSet));
    path
      .enter()
      .append("path")

      .attr("fill", function (d) {
        return color(d.data.Daily);
      })
      .attr("d", arc)
      .attr("class", "arc")
      .call(wrap);

    path
      .enter()
      .append("text")
      .merge(labelName)
      .attr("transform", function (d) {
        return "translate(" + labelNameArc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return `${d.data.Country} ${formatNumber(d.data.Daily)}`;
      })
      .attr("class", "labels")
      .call(wrap, 50);

    path.attr("d", arc);
  }

  update();
}
