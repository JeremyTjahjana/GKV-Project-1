const GENRE_CHART = document.getElementById("genre-chart");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error("Gagal memuat file CSV.");
    return;
  }

  const genreSales = {};
  rows.forEach((row) => {
    const genre = row.Genre || "Unknown";
    const sales = parseFloat(row.Global_Sales) || 0;
    genreSales[genre] = (genreSales[genre] || 0) + sales;
  });

  const sorted = Object.entries(genreSales).sort((a, b) => b[1] - a[1]);
  const genres = sorted.map((d) => d[0]);
  const sales = sorted.map((d) => parseFloat(d[1].toFixed(2)));

  const colors = [
    "#042C53","#0C447C","#185FA5","#185FA5",
    "#378ADD","#378ADD","#85B7EB","#85B7EB",
    "#B5D4F4","#B5D4F4","#E6F1FB","#E6F1FB",
  ];

  var trace = {
    x: genres,
    y: sales,
    type: "bar",
    marker: { color: colors },
    text: sales.map((s) => s.toFixed(1) + "M"),
    textposition: "outside",
    hovertemplate: "<b>%{x}</b><br>Global Sales: %{y:.1f} juta unit<extra></extra>",
  };

  var layout = {
    title: "Genre Game Terpopuler Berdasarkan Penjualan Global",
    xaxis: { title: "Genre", gridcolor: "#eee" },
    yaxis: { title: "Total Penjualan Global (juta unit)", gridcolor: "#eee" },
    font: { size: 13 },
    margin: { t: 50, b: 80, l: 70, r: 30 },
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "#ffffff",
  };

  Plotly.newPlot(GENRE_CHART, [trace], layout, { responsive: true });
});