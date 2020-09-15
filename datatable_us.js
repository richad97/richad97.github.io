d3.select("#us-datatable").append("table").attr("id", "us-table");

const formatNumber = d3.format(",.0f");

const arr = [];

//Datatable
const usTableVar = $("#us-table").DataTable({
  bLengthChange: false,
  bSortClasses: false,
  bSort: false,
  paging: false,
  info: false,
  order: [[1, "desc"]],
  data: arr,
  columns: [
    { data: "county", title: "COUNTY" },
    {
      data: "total",
      title: "CASES",
      render: $.fn.dataTable.render.number(",", "."),
    },
  ],
  columnDefs: [
    { className: "t-names", targets: [0] },
    { className: "t-numbers", targets: [1] },
  ],
  initComplete: () => {
    $("#us-table_filter").detach().appendTo("#us-new-search");
  },
  language: { search: "", searchPlaceholder: "Search Counties" },
  scrollY: 210,
  scrollx: true,
  scroller: true,
});

export function usTable(data, date) {
  const newArr = [];

  data.forEach((obj) => {
    const newObj = {
      county: obj.Combined_Key,
      total: +obj[date],
    };
    newArr.push(newObj);
  });

  newArr.sort((a, b) => (a.total > b.total ? -1 : 1));
  //newArr.splice(10)

  usTableVar.clear().draw();
  usTableVar.rows.add(newArr); // Add new data
  usTableVar.columns.adjust().draw(); // Redraw the DataTable

  //CASE-TOTAL
  const caseTotal = newArr.reduce((a, { total }) => a + total, 0);

  d3.select("#case-total").text(`${formatNumber(caseTotal)}`);
}
