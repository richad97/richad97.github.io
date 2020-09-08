let formatNumber = d3.format(",.0f");

let margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 800 - margin.left - margin.right,
  height = 335 - margin.top - margin.bottom;

let svg = d3
  .select("#map-col")
  .append("svg")
  .attr("id", "us-map-svg")
  .attr("viewBox", "170 0 600 600")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(
    d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    })
  )
  .append("g");

let projection = d3.geoAlbers().scale(1290);

let path = d3.geoPath();

let radius = d3
  .scaleSqrt()
  .domain([0, 1e6 * 0.1])
  .range([0, 8]);

let land = svg.append("path").attr("class", "land");

export function usMap(csv, w, str, date) {
  let newSet = [];

  csv.forEach((obj) => {
    let keyValues = {
      lat: obj["Lat"],
      long: obj["Long_"],
      name: obj["Combined_Key"],
      total: +obj[date],
    };

    newSet.push(keyValues);
  });

  land.attr("class", "county-borders").attr(
    "d",
    topojson.mesh(w, w.objects[str], function (a, b) {
      return a !== b;
    })
  );

  land.datum(topojson.feature(w, w.objects[str])).attr("d", path);

  let circles = svg
    .attr("class", "bubbles")
    .selectAll("circle")
    .data(
      newSet.sort(function (a, b) {
        return b.total - a.total;
      })
    );

  circles
    .enter()
    .append("circle")
    .merge(circles)
    .attr("transform", "translate(0,50)")
    .attr("cx", (d) => projection([d.long, d.lat])[0])
    .attr("cy", (d) => projection([d.long, d.lat])[1])
    .attr("r", (d) => radius(d.total))
    .append("title");

  circles.select("title").text(function (d) {
    return `${d.name} - ${formatNumber(d.total)}`;
  });
}
