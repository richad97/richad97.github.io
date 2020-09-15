const formatNumber = d3.format(",.0f");

const zoom = d3.zoom().scaleExtent([1, 15]).on("zoom", zoomed);

const margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 900 - margin.left - margin.right,
  height = 335 - margin.top - margin.bottom;

const svg = d3
  .select("#map-col")
  .append("svg")
  .attr("id", "us-map-svg")
  .attr("viewBox", "250 70 450 450")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg.call(zoom); // delete this line to disable free zooming

const projection = d3.geoAlbers().scale(1290);

const path = d3.geoPath();

const radius = d3
  .scaleSqrt()
  .domain([0, 1e6 * 0.01])
  .range([0, 8]);

const g = svg.append("g");

const land = g.append("path").attr("class", "land");

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform);
}

export function usMap(csv, w, str, date) {
  const newSet = [];

  csv.forEach((obj) => {
    const keyValues = {
      lat: obj["Lat"],
      long: obj["Long_"],
      name: obj["Combined_Key"],
      total: +obj[date],
    };

    newSet.push(keyValues);
  });

  land.datum(topojson.feature(w, w.objects[str])).attr("d", path);

  const circles = g
    .attr("class", "bubbles")
    .selectAll("circle")
    .data(
      newSet.sort((a, b) => {
        return b.total - a.total;
      })
    );

  circles
    .enter()
    .append("circle")
    .merge(circles)
    // REVISE
    .attr("transform", "translate(0,50)")
    .attr("cx", (d) => projection([d.long, d.lat])[0])
    .attr("cy", (d) => projection([d.long, d.lat])[1])
    .attr("r", (d) => radius(d.total))
    .append("title");

  circles.select("title").text((d) => {
    return `${d.name} - ${formatNumber(d.total)}`;
  });
}
