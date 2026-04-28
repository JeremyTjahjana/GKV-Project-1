# GKV Project 1 — Analisis Data Video Game Sales (Kaggle)

Proyek ini merupakan dashboard interaktif untuk menganalisis data penjualan video game dari Kaggle menggunakan HTML, JavaScript (Plotly.js), dan CSV.

---

## 📋 Struktur Proyek

```
GKV-Project-1/
├── index.html           # File HTML utama (halaman dashboard)
├── gamepertahun.js      # Script JavaScript untuk grafik "Tren Perilisan Per Tahun"
├── vgsales.csv          # Data video game sales dari Kaggle
└── README.md            # File dokumentasi ini
```

---

## 🚀 Cara Menjalankan Proyek

1. **Pastikan file `vgsales.csv` ada di folder proyek (KALAU ADA GAUSAH DIBWH INI, UDH ADA CSVNYA KOK)**
   - Download dari Kaggle: [Video Game Sales Dataset](https://www.kaggle.com/datasets/gregorut/videogamesales)
   - Atau gunakan Kaggle CLI:
     ```bash
     kaggle datasets download -d gregorut/videogamesales
     unzip videogamesales.zip
     ```

2. **Buka file `index.html` di browser**
   - Klik dua kali pada `index.html`, atau
   - Gunakan Live Server (VS Code) dengan klik kanan → "Open with Live Server"

3. **Lihat grafik yang muncul**
   - Grafik akan dimuat otomatis dari data `vgsales.csv`

---

## 📊 Struktur Data `vgsales.csv`

File CSV memiliki kolom berikut:

| Kolom          | Tipe   | Deskripsi                           |
| -------------- | ------ | ----------------------------------- |
| `Name`         | String | Nama game                           |
| `Platform`     | String | Platform (PS2, X360, ds, etc.)      |
| `Year`         | Number | Tahun rilis                         |
| `Genre`        | String | Genre (Action, Sports, etc.)        |
| `Publisher`    | String | Penerbit game                       |
| `NA_Sales`     | Number | Penjualan di Amerika Utara (jutaan) |
| `EU_Sales`     | Number | Penjualan di Eropa (jutaan)         |
| `JP_Sales`     | Number | Penjualan di Jepang (jutaan)        |
| `Other_Sales`  | Number | Penjualan di region lain (jutaan)   |
| `Global_Sales` | Number | Total penjualan global (jutaan)     |

---

## ➕ Cara Menambahkan Grafik Baru

### **Step 1: Buat File JavaScript Baru**

Buat file dengan nama deskriptif, misal: `topsales.js`

```javascript
// Referensi elemen DOM
const TOP_SALES_CHART = document.getElementById("top-sales-chart");

// Membaca file CSV
Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error("Gagal memuat CSV:", err);
    return;
  }

  // CONTOH 1: Grafik Top 10 Game dengan Penjualan Tertinggi
  // Urutkan berdasarkan Global_Sales dan ambil top 10
  const sortedGames = rows
    .map((row) => ({
      name: row.Name,
      sales: parseFloat(row.Global_Sales) || 0,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const gameNames = sortedGames.map((g) => g.name);
  const gameSales = sortedGames.map((g) => g.sales);

  var trace = {
    x: gameNames,
    y: gameSales,
    type: "bar",
    marker: { color: "#FF6B6B" },
  };

  var layout = {
    title: "Top 10 Game dengan Penjualan Tertinggi",
    xaxis: { title: "Nama Game", tickangle: -45 },
    yaxis: { title: "Penjualan Global (juta)" },
    margin: { b: 150 },
  };

  Plotly.newPlot(TOP_SALES_CHART, [trace], layout, { responsive: true });
});
```

### **Step 2: Tambahkan Section di `index.html`**

Buka `index.html` dan tambahkan section baru (sesuaikan `id` dengan file JS):

```html
<section>
  <h2>Top 10 Game dengan Penjualan Tertinggi</h2>
  <p>Grafik di bawah menunjukkan 10 game dengan penjualan global terbesar.</p>
  <div id="top-sales-chart"></div>
</section>
```

### **Step 3: Tambahkan Script Reference di `index.html`**

Di bagian `</body>`, tambahkan script reference untuk file JS baru:

```html
<script src="gamepertahun.js"></script>
<script src="topsales.js"></script>  <!-- Tambahkan ini -->
</body>
```

---

## 💡 Contoh Grafik Lainnya

### **Contoh 2: Grafik Genre Terpopuler (Pie Chart)**

```javascript
const GENRE_CHART = document.getElementById("genre-chart");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error("Gagal memuat CSV:", err);
    return;
  }

  // Hitung jumlah game per genre
  const genreCount = {};
  rows.forEach((row) => {
    const genre = row.Genre || "Unknown";
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  const genres = Object.keys(genreCount);
  const counts = Object.values(genreCount);

  var trace = {
    labels: genres,
    values: counts,
    type: "pie",
  };

  var layout = {
    title: "Distribusi Genre Game",
  };

  Plotly.newPlot(GENRE_CHART, [trace], layout, { responsive: true });
});
```

### **Contoh 3: Penjualan per Region (Stacked Bar Chart)**

```javascript
const REGION_CHART = document.getElementById("region-chart");

Plotly.d3.csv("vgsales.csv", function (err, rows) {
  if (err) {
    console.error("Gagal memuat CSV:", err);
    return;
  }

  // Hitung total penjualan per region
  let naSales = 0,
    euSales = 0,
    jpSales = 0,
    otherSales = 0;

  rows.forEach((row) => {
    naSales += parseFloat(row.NA_Sales) || 0;
    euSales += parseFloat(row.EU_Sales) || 0;
    jpSales += parseFloat(row.JP_Sales) || 0;
    otherSales += parseFloat(row.Other_Sales) || 0;
  });

  var trace = {
    x: ["Penjualan Regional"],
    y: [naSales],
    name: "NA (Amerika Utara)",
    type: "bar",
  };

  var trace2 = {
    x: ["Penjualan Regional"],
    y: [euSales],
    name: "EU (Eropa)",
    type: "bar",
  };

  var trace3 = {
    x: ["Penjualan Regional"],
    y: [jpSales],
    name: "JP (Jepang)",
    type: "bar",
  };

  var trace4 = {
    x: ["Penjualan Regional"],
    y: [otherSales],
    name: "Other (Lainnya)",
    type: "bar",
  };

  var layout = {
    title: "Total Penjualan per Region",
    barmode: "stack",
    yaxis: { title: "Penjualan (juta)" },
  };

  Plotly.newPlot(REGION_CHART, [trace, trace2, trace3, trace4], layout, {
    responsive: true,
  });
});
```

---

## 📚 Referensi Plotly.js

- [Dokumentasi Plotly.js](https://plotly.com/javascript/)
- [Tipe-tipe Chart](https://plotly.com/javascript/): scatter, bar, pie, histogram, dll.
