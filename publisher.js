const PUBLISHER_SCATTER = document.getElementById("publisher-scatter");
const PUBLISHER_SUMMARY = document.getElementById("publisher-summary");
const PUBLISHER_NOTE = document.getElementById("publisher-note");

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function createSummaryCard(label, value, accentColor) {
  return `
    <div style="min-width: 136px; background: #ffffff; border: 1px solid #e8eef6; border-top: 3px solid ${accentColor}; border-radius: 8px; padding: 10px 12px; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);">
      <div style="font-size: 12px; color: #6b778c; margin-bottom: 4px;">${label}</div>
      <div style="font-size: 18px; font-weight: 700; color: #172033;">${value}</div>
    </div>
  `;
}

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
        totalSales: 0,
        count: 0,
      };
    }

    publisherStats[publisher].totalSales += sales;
    publisherStats[publisher].count += 1;
  });

  const publisherData = Object.entries(publisherStats)
    .map(([publisher, data]) => ({
      publisher,
      count: data.count,
      totalSales: data.totalSales,
      efficiency: data.totalSales / data.count,
    }))
    .filter((data) => data.count >= 5 && data.totalSales > 0)
    .sort((a, b) => b.totalSales - a.totalSales);

  const publishers = publisherData.map((data) => data.publisher);
  const counts = publisherData.map((data) => data.count);
  const efficiency = publisherData.map((data) => data.efficiency);
  const totalSales = publisherData.map((data) => data.totalSales);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  const minEfficiency = Math.min(...efficiency);
  const maxEfficiency = Math.max(...efficiency);
  const maxSales = Math.max(...totalSales);
  const medianCount = median(counts);
  const medianEfficiency = median(efficiency);
  const labelPublishers = new Set([
    ...publisherData.slice(0, 5).map((data) => data.publisher),
    ...[...publisherData].sort((a, b) => b.efficiency - a.efficiency).slice(0, 4).map((data) => data.publisher),
  ]);

  if (PUBLISHER_SUMMARY) {
    const mostEfficient = [...publisherData].sort((a, b) => b.efficiency - a.efficiency)[0];
    const highestVolume = [...publisherData].sort((a, b) => b.count - a.count)[0];

    PUBLISHER_SUMMARY.innerHTML = [
      createSummaryCard("Publisher", publisherData.length, "#2563eb"),
      createSummaryCard("Paling efisien", mostEfficient.publisher, "#16a34a"),
      createSummaryCard("Volume terbesar", highestVolume.publisher, "#f97316"),
    ].join("");
  }

  if (PUBLISHER_NOTE) {
    PUBLISHER_NOTE.innerHTML =
      "Axis memakai skala log agar publisher kecil-menengah tetap terlihat jelas. Garis putus-putus menunjukkan median volume dan median rata-rata sales per game." +
      "<br><br><b>Interpretasi area:</b> kiri atas = sedikit game tetapi rata-rata sales tinggi; kanan atas = banyak game dan rata-rata sales tinggi; kiri bawah = sedikit game dan rata-rata sales rendah; kanan bawah = banyak game tetapi rata-rata sales rendah.";
  }

  const trace = {
    x: counts,
    y: efficiency,
    customdata: totalSales,
    hovertext: publishers,
    text: publishers.map((publisher) => (labelPublishers.has(publisher) ? publisher : "")),
    mode: "markers+text",
    type: "scatter",
    marker: {
      size: totalSales,
      sizemode: "area",
      sizeref: (2 * maxSales) / (34 ** 2),
      sizemin: 6,
      color: totalSales,
      colorscale: [
        [0, "#8ecae6"],
        [0.45, "#219ebc"],
        [0.75, "#ffb703"],
        [1, "#fb8500"],
      ],
      line: {
        color: "#ffffff",
        width: 1.2,
      },
      colorbar: {
        title: "Total Sales",
        ticksuffix: "M",
        thickness: 12,
        len: 0.72,
      },
      opacity: 0.72,
    },
    textposition: "top center",
    textfont: {
      size: 11,
      color: "#263445",
    },
    hovertemplate:
      "<b>%{hovertext}</b><br>" +
      "Jumlah Game: %{x}<br>" +
      "Avg Sales/Game: %{y:.2f} juta<br>" +
      "Total Sales: %{customdata:.2f} juta<extra></extra>",
  };

  const layout = {
    title: {
      text: "Publisher: Volume Rilis vs Efisiensi Sales",
      font: {
        size: 20,
        color: "#172033",
      },
      x: 0.04,
    },
    paper_bgcolor: "#ffffff",
    plot_bgcolor: "#f8fbff",
    margin: {
      l: 78,
      r: 36,
      t: 76,
      b: 72,
    },
    xaxis: {
      title: "Jumlah Game yang Dirilis (skala log)",
      type: "log",
      range: [Math.log10(minCount * 0.82), Math.log10(maxCount * 1.22)],
      tickmode: "array",
      tickvals: [5, 10, 25, 50, 100, 250, 500, 1000],
      gridcolor: "#e7eef7",
      zeroline: false,
    },
    yaxis: {
      title: "Rata-rata Sales per Game (juta, skala log)",
      type: "log",
      range: [Math.log10(minEfficiency * 0.78), Math.log10(maxEfficiency * 1.2)],
      tickmode: "array",
      tickvals: [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
      gridcolor: "#e7eef7",
      zeroline: false,
    },
    shapes: [
      {
        type: "line",
        x0: medianCount,
        x1: medianCount,
        y0: minEfficiency * 0.78,
        y1: maxEfficiency * 1.2,
        line: {
          color: "#94a3b8",
          width: 1,
          dash: "dot",
        },
      },
      {
        type: "line",
        x0: minCount * 0.82,
        x1: maxCount * 1.22,
        y0: medianEfficiency,
        y1: medianEfficiency,
        line: {
          color: "#94a3b8",
          width: 1,
          dash: "dot",
        },
      },
    ],
    annotations: [
      {
        x: maxCount * 0.72,
        y: maxEfficiency * 0.9,
        text: "High volume + high efficiency",
        showarrow: false,
        font: {
          size: 12,
          color: "#0f766e",
        },
        bgcolor: "rgba(236, 253, 245, 0.9)",
        bordercolor: "#99f6e4",
        borderpad: 5,
      },
    ],
    hoverlabel: {
      bgcolor: "#172033",
      bordercolor: "#172033",
      font: {
        color: "#ffffff",
      },
    },
  };

  Plotly.newPlot(PUBLISHER_SCATTER, [trace], layout, {
    responsive: true,
    displaylogo: false,
  });
});
