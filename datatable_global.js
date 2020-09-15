let formatNumber = d3.format(",.0f");

d3.select("#global-datatable").append("table").attr("id", "global-table");
let arr = [];

//Datatable
let globalTableVar = $("#global-table").DataTable({
  bLengthChange: false,
  bSortClasses: false,
  bSort: false,
  paging: false,
  info: false,
  order: [[1, "desc"]],
  data: arr,
  columns: [
    { data: "Country", title: "COUNTRY" },
    {
      data: "confirmed",
      title: "CASES",
      render: $.fn.dataTable.render.number(",", "."),
    },
  ],
  columnDefs: [
    { className: "t-names", targets: [0] },
    { className: "t-numbers", targets: [1] },
  ],
  initComplete: function () {
    $("#global-table_filter").detach().appendTo("#global-new-search");
  },
  language: { search: "", searchPlaceholder: "Search Countries" },
  scrollY: 210,
  scrollx: true,
  scroller: true,
});

export function globalTable(data, date) {
  let newArr = [];

  data.forEach((obj) => {
    let newObj = {
      Country: obj["Country/Region"],
      confirmed: +obj[date],
    };
    newArr.push(newObj);
  });

  newArr.sort((a, b) => (a.confirmed > b.confirmed ? -1 : 1));
  //newArr.splice(10)

  globalTableVar.clear().draw();
  globalTableVar.rows.add(newArr); // Add new data
  globalTableVar.columns.adjust().draw(); // Redraw the DataTable

  let caseTotal = newArr.reduce((a, { confirmed }) => a + confirmed, 0);

  d3.select("#case-total").text(`${formatNumber(caseTotal)}`);
}

/*
  //Global Confirmed Total


*/
