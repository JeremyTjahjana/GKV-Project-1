// Referensi elemen DOM
const LINE_PLOT = document.getElementById("line_chart");

// Membaca file CSV (Sesuai metode d3 pada tutorial Halaman 11)
Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error(
      "Gagal memuat file CSV. Pastikan file 'vgsales.csv' ada di folder yang sama.",
    );
    return;
  }

  // 1. MENGOLAH DATA: Menghitung jumlah game per tahun
  const yearsCount = {};
  rows.forEach((row) => {
    let year = row.Year;
    // Abaikan data yang tahunnya "N/A"
    if (year && year !== "N/A") {
      yearsCount[year] = (yearsCount[year] || 0) + 1;
    }
  });

  // 2. MENGURUTKAN TAHUN (Agar grafik garis tidak berantakan)
  const sortedYears = Object.keys(yearsCount).sort();
  const releaseCounts = sortedYears.map((year) => yearsCount[year]);

  // 3. KONFIGURASI PLOTLY (Sesuai Bagian 3.3.b)
  var trace1 = {
    x: sortedYears,
    y: releaseCounts,
    mode: "lines+markers", // Mode garis dengan titik penanda
    type: "scatter", // Tipe scatter digunakan untuk line chart di Plotly
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

  var config = { responsive: true }; // Sesuai Gambar 3.10

  // 4. MEMBUAT PLOT (Halaman 5)
  Plotly.newPlot(LINE_PLOT, data, layout, config);
});
