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

  const labels = Object.keys(genreSales);
  const values = labels.map((g) => parseFloat(genreSales[g].toFixed(2)));

  var trace = {
    labels: labels,
    values: values,
    type: "pie",
    textinfo: "label+percent",
    hovertemplate: "<b>%{label}</b><br>Penjualan: %{value:.1f} juta unit<br>Persentase: %{percent}<extra></extra>",
    marker: {
      colors: [
        "#003f5c","#2f4b7c","#665191","#a05195",
        "#d45087","#f95d6a","#ff7c43","#ffa600",
        "#4E79A7","#76B7B2","#59A14F","#EDC948"
      ],
    },
  };

  var layout = {
    title: "Distribusi Genre Game Berdasarkan Penjualan Global",
    font: { size: 13 },
    margin: { t: 50, b: 30, l: 30, r: 30 },
    paper_bgcolor: "#ffffff",
  };

  Plotly.newPlot(GENRE_CHART, [trace], layout, { responsive: true });
});