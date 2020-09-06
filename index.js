import { barChart } from "/barchart.js";
import { pieChart } from "/piechart.js";
import { lineChart } from "/linechart.js";
import { map } from "/map.js";
import { usMap } from "/mapus.js";
import { globalTable } from "/datatable-global.js";
import { usTable } from "/datatable-us.js";

d3.queue()

  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
  )
  .defer(d3.json, "https://d3js.org/us-10m.v1.json")
  .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")

  .await(ready);

//UPDATES CSV DAILY IN CORRECT FORMAT
let d = new Date(),
  curr_month = d.getMonth() + 1, //MONTHS ARE ZERO BASED
  curr_date = d.getDate() - 2,
  curr_year = d.getFullYear().toString().substr(-2),
  date = `${curr_month}/${curr_date}/${curr_year}`;

//CHANGES BUTTON COLOR ON CLICK
$("button").click(function () {
  $("button").removeClass("active");
  $(this).addClass("active");
});

function ready(
  error,
  gConfirmedCSV,
  gDeathsCSV,
  gRecoveredCSV,
  uConfirmedCSV,
  uDeathsCSV,
  us,
  world
) {
  //LOADED AT START
  barChart(gDeathsCSV, "Country/Region", date);

  lineChart(gDeathsCSV);

  pieChart(gDeathsCSV, "Country/Region", date);

  map(gDeathsCSV, world, "Country/Region", date);

  usTable(uDeathsCSV, date);

  globalTable(gDeathsCSV, date);

  $("#barchart-type").text("COUNTRY");
  $("#piechart-type").text("COUNTRY");
  $("#linechart-type").text("GLOBAL");
  $("#type-total").text("GLOBAL");
  $("#case-type").text("DEATHS");
  $("#case-total").css("color", "#ff5e4f");

  $("#update-stamp").text(date);

  //USED FOR MAP
  $("#global-map-svg").show();
  $("#us-map-svg").hide();

  //JQUERY FOR EASIER BUTTON FUNCTIONALITY
  $("#global-btn-confirmed").click(function () {
    lineChart(gConfirmedCSV);
    barChart(gConfirmedCSV, "Country/Region", date);
    pieChart(gConfirmedCSV, "Country/Region", date);
    map(gConfirmedCSV, world, "Country/Region", date);
    globalTable(gConfirmedCSV, date);

    $("#barchart-type").text("COUNTRY");
    $("#piechart-type").text("COUNTRY");
    $("#linechart-type").text("GLOBAL");
    $("#case-type").text("CONFIRMED");

    $("#type-total").text("GLOBAL");
    $("#case-total").css("color", "#729ff7");

    $("#global-map-svg").show();
    $("#us-map-svg").hide();
  });

  $("#global-btn-deaths").click(function () {
    lineChart(gDeathsCSV);
    barChart(gDeathsCSV, "Country/Region", date);
    pieChart(gDeathsCSV, "Country/Region", date);
    map(gDeathsCSV, world, "Country/Region", date);
    globalTable(gDeathsCSV, date);

    $("#barchart-type").text("COUNTRY");
    $("#piechart-type").text("COUNTRY");
    $("#linechart-type").text("GLOBAL");
    $("#case-type").text("DEATHS");

    $("#type-total").text("GLOBAL");
    $("#case-total").css("color", "#ff5e4f");

    $("#global-map-svg").show();
    $("#us-map-svg").hide();
  });

  $("#global-btn-recovered").click(function () {
    lineChart(gRecoveredCSV);
    barChart(gRecoveredCSV, "Country/Region", date);
    pieChart(gRecoveredCSV, "Country/Region", date);
    map(gRecoveredCSV, world, "Country/Region", date);
    globalTable(gRecoveredCSV, date);

    $("#barchart-type").text("COUNTRY");
    $("#piechart-type").text("COUNTRY");
    $("#linechart-type").text("GLOBAL");
    $("#case-type").text("RECOVERED");

    $("#type-total").text("GLOBAL");
    $("#case-total").css("color", "#63ff85");

    $("#global-map-svg").show();
    $("#us-map-svg").hide();
  });

  $("#us-btn-confirmed").click(function () {
    lineChart(uConfirmedCSV);
    barChart(uConfirmedCSV, "Admin2", date);
    pieChart(uConfirmedCSV, "Admin2", date);
    usTable(uConfirmedCSV, date);
    usMap(uConfirmedCSV, us, "states", date);

    $("#barchart-type").text("COUNTY");
    $("#piechart-type").text("COUNTY");
    $("#linechart-type").text("US");
    $("#case-type").text("CONFIRMED");

    $("#type-total").text("US");
    $("#case-total").css("color", "#729ff7");

    $("#global-map-svg").hide();
    $("#us-map-svg").show();
  });

  $("#us-btn-deaths").click(function () {
    lineChart(uDeathsCSV);
    barChart(uDeathsCSV, "Admin2", date);
    pieChart(uDeathsCSV, "Admin2", date);
    usTable(uDeathsCSV, date);
    usMap(uDeathsCSV, us, "states", date);

    $("#barchart-type").text("COUNTY");
    $("#piechart-type").text("COUNTY");
    $("#linechart-type").text("US");
    $("#case-type").text("DEATHS");

    $("#type-total").text("US");
    $("#case-total").css("color", "#ff5e4f");

    $("#global-map-svg").hide();
    $("#us-map-svg").show();
  });
  $("#global-btn-deaths").click();
}
