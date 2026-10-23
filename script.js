const DEFAULT_PROPERTIES = [
  {
    id: 1,
    nama: "Grand Lumajang Residence",
    developer: "PT. Developer Utama",
    lokasi: "Kec. Lumajang",
    alamat: "Jl. Raya Lumajang No. 123",
    tipe: "Rumah Komersil",
    harga: 450000000,
    luasTanah: 90,
    luasBangunan: 60,
    kamarTidur: 3,
    kamarMandi: 2,
    status: "Ready Stock",
    gambar: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
    deskripsi: "Cluster eksklusif dengan keamanan 24 jam, dekat dengan pusat kota Lumajang dan fasilitas umum."
  }
];

let activeProperties = DEFAULT_PROPERTIES;
const storedProps = localStorage.getItem("PROPERTIES_DATA");
if (storedProps) {
  try { activeProperties = JSON.parse(storedProps); } catch(e){}
}

const storedConfig = localStorage.getItem("CONFIG_OVERRIDE");
if (storedConfig) {
  try { Object.assign(CONFIG, JSON.parse(storedConfig)); } catch(e){}
}

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  renderPropertyList(activeProperties);
});

function initUI() {
  document.getElementById("logoText").innerText = CONFIG.namaWebsite || "Properti Lumajang";
  document.getElementById("profilNama").innerText = CONFIG.namaMarketing || "Marketing";
  document.getElementById("profilJabatan").innerText = CONFIG.jabatan || "Executive Marketing";
  if (CONFIG.fotoProfil) document.getElementById("profilFoto").src = CONFIG.fotoProfil;

  const waUrl = `https://wa.me/${CONFIG.nomorWA}?text=${encodeURIComponent(CONFIG.pesanDefault)}`;
  document.getElementById("heroWaBtn").href = waUrl;
  document.getElementById("aboutWaBtn").href = waUrl;
  document.getElementById("floatingWa").href = waUrl;

  document.getElementById("statProperti").innerText = activeProperties.length;
  document.getElementById("statDeveloper").innerText = new Set(activeProperties.map(p => p.developer)).size;
  document.getElementById("statTestimoni").innerText = "15+";
}

function renderPropertyList(list) {
  const grid = document.getElementById("propertyGrid");
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";

  if (list.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.onclick = () => openPropertyModal(item);

    card.innerHTML = `
      <div class="property-img-wrap">
        <img src="${item.gambar}" alt="${item.nama}" loading="lazy">
        <span class="property-badge ${item.status === 'Ready Stock' ? 'status-ready' : 'status-indent'}">${item.status}</span>
      </div>
      <div class="property-body">
        <div class="property-developer">${item.developer}</div>
        <h3 class="property-title">${item.nama}</h3>
        <div class="property-location">📍 ${item.lokasi}</div>
        <div class="property-specs">
          <span>📐 ${item.luasBangunan}/${item.luasTanah} m²</span>
          <span>🛏️ ${item.kamarTidur} KT</span>
          <span>🚿 ${item.kamarMandi} KM</span>
        </div>
        <div class="property-price">Rp ${Number(item.harga).toLocaleString('id-ID')}</div>
        <div class="property-actions">
          <button class="btn btn-detail">Detail</button>
          <a href="https://wa.me/${CONFIG.nomorWA}?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(item.nama)}" target="_blank" class="btn btn-wa" onclick="event.stopPropagation()">💬 Tanya WA</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openPropertyModal(item) {
  const modalBody = document.getElementById("modalBody");
  const modal = document.getElementById("propertyModal");

  modalBody.innerHTML = `
    <img src="${item.gambar}" class="modal-property-img" alt="${item.nama}">
    <h2 class="modal-property-title">${item.nama}</h2>
    <p class="modal-property-dev">${item.developer} • ${item.lokasi}</p>
    <div class="modal-property-price">Rp ${Number(item.harga).toLocaleString('id-ID')}</div>
    
    <div class="modal-property-specs">
      <div class="spec-item"><strong>${item.luasBangunan} m²</strong><span>Luas Bangunan</span></div>
      <div class="spec-item"><strong>${item.luasTanah} m²</strong><span>Luas Tanah</span></div>
      <div class="spec-item"><strong>${item.kamarTidur}</strong><span>Kamar Tidur</span></div>
      <div class="spec-item"><strong>${item.kamarMandi}</strong><span>Kamar Mandi</span></div>
    </div>

    ${item.video ? `<div class="mb-4"><iframe class="w-full h-64 rounded-lg" src="${item.video}" frameborder="0" allowfullscreen></iframe></div>` : ''}

    <div class="modal-property-desc">
      <h4 class="font-bold text-slate-800 mb-1">Deskripsi & Fasilitas:</h4>
      <p class="whitespace-pre-line text-sm text-slate-600">${item.deskripsi || 'Tidak ada deskripsi tambahan.'}</p>
    </div>

    <a href="https://wa.me/${CONFIG.nomorWA}?text=Halo,%20saya%20ingin%20survei%20lokasi%20${encodeURIComponent(item.nama)}" target="_blank" class="btn btn-wa btn-block">💬 Hubungi Sales via WhatsApp</a>
  `;

  modal.classList.add("active");
}

document.getElementById("modalClose").onclick = () => {
  document.getElementById("propertyModal").classList.remove("active");
};