const PUBLISHER_SCATTER = document.getElementById("publisher-scatter");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error(err);
    return;
  }

  const publisherStats = {};

  rows.forEach((row) => {
    const publisher = row.Publisher || "Unknown";
    const sales = parseFloat(row.Global_Sales) || 0;

    if (!publisherStats[publisher]) {
      publisherStats[publisher] = {
        total_sales: 0,
        count: 0,
      };
    }

    publisherStats[publisher].total_sales += sales;
    publisherStats[publisher].count += 1;
  });

  const publishers = [];
  const counts = [];
  const efficiency = [];
  const sizes = [];

  Object.entries(publisherStats).forEach(([publisher, data]) => {
    if (data.count < 5) return; // filter kecil biar ga noisy

    const avg = data.total_sales / data.count;

    publishers.push(publisher);
    counts.push(data.count);
    efficiency.push(avg);
    sizes.push(data.total_sales); // ukuran bubble
  });

  const trace = {
    x: counts,
    y: efficiency,
    text: publishers,
    mode: "markers",
    type: "scatter",
    marker: {
      size: sizes.map((s) => Math.sqrt(s) * 3),
      sizemode: "area",
      opacity: 0.7,
    },
    hovertemplate:
      "<b>%{text}</b><br>Jumlah Game: %{x}<br>Avg Sales: %{y:.2f} juta<extra></extra>",
  };

  const layout = {
    title: "Sales Efficiency vs Volume Publisher",
    xaxis: { title: "Jumlah Game (Volume)" },
    yaxis: { title: "Rata-rata Sales per Game (juta)" },
  };

  Plotly.newPlot(PUBLISHER_SCATTER, [trace], layout, {
    responsive: true,
  });
});