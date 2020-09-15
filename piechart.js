const formatNumber = d3.format(",.0f");

const margin = { top: -5, right: 0, bottom: 0, left: 0 },
  width = 250 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

const svg = d3
  .select("#piechart-col")
  .append("svg")
  .attr("id", "piechart-svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const radius = width / 3;

const arc = d3.arc().innerRadius(0).outerRadius(radius);

const labelNameArc = d3.arc().innerRadius(135).outerRadius(radius);

const color = d3.scaleOrdinal([
  "#5E5D5E",
  "#7C7C7C",
  "#9B9B9B",
  "#C7C7C7",
  "#FFFFFF",
]);

const wrap = (text) => {
  text.each(function (d) {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      lineNumber = 0,
      lineHeight = 1.1;
    // null out text
    text.text(null);
    // loop the words
    while ((word = words.pop())) {
      // build tspan
      let tspan = text
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
};

export function pieChart(data, str, date) {
  const arr = [];

  data.forEach((elem) => {
    const mostRecent = +elem[date];
    const country = elem[str];

    window.obj = {
      Daily: mostRecent,
      Country: country,
    };

    arr.push(obj);
  });

  const newSet = arr.sort((a, b) => (a.Daily > b.Daily ? -1 : 1)).slice(0, 5);

  function update() {
    const pie = d3
      .pie()
      .value((d) => {
        return d.Daily;
      })
      .padAngle(0.0);

    const path = svg.selectAll("path").data(pie(newSet));
    const labelName = svg.selectAll(".labels").data(pie(newSet));

    path
      .enter()
      .append("path")

      .attr("fill", (d) => {
        return color(d.data.Daily);
      })
      .attr("d", arc)
      .attr("class", "arc")
      .call(wrap);

    path
      .enter()
      .append("text")
      .merge(labelName)
      .attr("transform", (d) => {
        return "translate(" + labelNameArc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text((d) => {
        return `${d.data.Country} ${formatNumber(d.data.Daily)}`;
      })
      .attr("class", "labels")
      .call(wrap, 50);

    path.attr("d", arc);
  }

  update();
}
