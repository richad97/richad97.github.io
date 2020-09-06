let formatNumber = d3.format(",.0f");

let margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 290 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

let svg = d3
  .select("#us-piechart-col")
  .append("svg")
  .attr("id", "us-piechart-svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let radius = width / 3.5;

let arc = d3.arc().innerRadius(50).outerRadius(radius);
let labelNameArc = d3.arc().innerRadius(130).outerRadius(radius);

let color = d3.scaleOrdinal([
  "#5E5D5E",
  "#7C7C7C",
  "#9B9B9B",
  "#C7C7C7",
  "#FFFFFF",
]);

export function usPieChart(data) {
  let arr = [];

  data.forEach((elem) => {
    let mostRecent = +elem["8/14/20"];
    let country = elem["Province_State"];

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
      .padAngle(0.025);
    let path = svg.selectAll("path").data(pie(newSet));
    let labelName = svg.selectAll(".labels").data(pie(newSet));

    path
      .enter()
      .append("path")

      .attr("fill", function (d) {
        return color(d.data.Daily);
      })
      .attr("d", arc)
      .attr("class", "arc");

    path
      .enter()
      .append("text")
      .merge(labelName)
      .attr("transform", function (d) {
        return "translate(" + labelNameArc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return `${formatNumber(d.data.Daily)} - ${d.data.Country}`;
      })

      .attr("class", "labels");

    path.attr("d", arc);
  }

  update();
}
