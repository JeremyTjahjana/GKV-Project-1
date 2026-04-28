const LINE_PLOT = document.getElementById("line_chart");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error(
      "Gagal memuat file CSV. Pastikan file 'vgsales.csv' ada di folder yang sama.",
    );
    return;
  }
  const yearsCount = {};
  rows.forEach((row) => {
    let year = row.Year;
    // Abaikan data yang tahunnya "N/A"
    if (year && year !== "N/A") {
      yearsCount[year] = (yearsCount[year] || 0) + 1;
    }
  });

  const sortedYears = Object.keys(yearsCount).sort();
  const releaseCounts = sortedYears.map((year) => yearsCount[year]);

  var trace1 = {
    x: sortedYears,
    y: releaseCounts,
    mode: "lines+markers",
    type: "scatter",
    name: "Jumlah Rilis",
    line: {
      color: "#17BECF",
      width: 3,
    },
    marker: {
      size: 8,
      color: "#118da0",
    },
  };

  var data = [trace1];

  var layout = {
    title: "Tren Perilisan Game Per Tahun",
    xaxis: {
      title: "Tahun",
      gridcolor: "#eee",
    },
    yaxis: {
      title: "Jumlah Game yang Dirilis",
      gridcolor: "#eee",
    },
    font: { size: 14 },
    margin: { t: 50, b: 50, l: 60, r: 30 },
  };

  var config = { responsive: true };

  Plotly.newPlot(LINE_PLOT, data, layout, config);
});
