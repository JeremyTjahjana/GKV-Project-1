const REGION_CHART = document.getElementById("region-chart");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error("Gagal memuat CSV:", err);
    return;
  }

  const genreSales = {};

  rows.forEach((row) => {
    const genre = row.Genre || "Unknown";
    if (!genreSales[genre]) {
      genreSales[genre] = { NA: 0, EU: 0, JP: 0, Other: 0 };
    }
    genreSales[genre].NA += parseFloat(row.NA_Sales) || 0;
    genreSales[genre].EU += parseFloat(row.EU_Sales) || 0;
    genreSales[genre].JP += parseFloat(row.JP_Sales) || 0;
    genreSales[genre].Other += parseFloat(row.Other_Sales) || 0;
  });

  const genres = Object.keys(genreSales);

  var traces = [
    {
      x: genres,
      y: genres.map((g) => genreSales[g].NA),
      name: "Amerika Utara",
      type: "bar",
      marker: { color: "#4E79A7" },
    },
    {
      x: genres,
      y: genres.map((g) => genreSales[g].EU),
      name: "Eropa",
      type: "bar",
      marker: { color: "#F28E2B" },
    },
    {
      x: genres,
      y: genres.map((g) => genreSales[g].JP),
      name: "Jepang",
      type: "bar",
      marker: { color: "#E15759" },
    },
    {
      x: genres,
      y: genres.map((g) => genreSales[g].Other),
      name: "Lainnya",
      type: "bar",
      marker: { color: "#76B7B2" },
    },
  ];

  var layout = {
    title: "Siapa yang Paling Boros Beli Game?",
    barmode: "stack",
    xaxis: { title: "Genre" },
    yaxis: { title: "Total Penjualan (juta)" },
    font: { size: 13 },
    margin: { t: 50, b: 80, l: 60, r: 30 },
  };

  Plotly.newPlot(REGION_CHART, traces, layout, { responsive: true });
});