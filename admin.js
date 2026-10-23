let propertiesData = [];

window.onload = function() {
  checkAuthSession();
};

function checkAuthSession() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
  if (isLoggedIn === "true") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    loadData();
  } else {
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("dashboardSection").classList.add("hidden");
  }
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById("loginUsername").value;
  const p = document.getElementById("loginPassword").value;

  if (u === "admin" && p === "admin123") {
    sessionStorage.setItem("adminLoggedIn", "true");
    checkAuthSession();
  } else {
    alert("Username atau password salah!");
  }
}

function handleLogout() {
  sessionStorage.removeItem("adminLoggedIn");
  checkAuthSession();
}

function loadData() {
  const storedProps = localStorage.getItem("PROPERTIES_DATA");
  if (storedProps) {
    try {
      propertiesData = JSON.parse(storedProps);
    } catch(e) {
      propertiesData = [];
    }
  } else {
    propertiesData = [
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
        gambar: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        deskripsi: "Cluster eksklusif dengan keamanan 24 jam, lokasi sangat strategis dan siap huni."
      }
    ];
  }
  renderAdminTable();

  // Load Profil Config
  if (typeof CONFIG !== "undefined") {
    const storedCfg = localStorage.getItem("CONFIG_OVERRIDE");
    if (storedCfg) {
      try { Object.assign(CONFIG, JSON.parse(storedCfg)); } catch(e){}
    }
    if(document.getElementById("cfgNama")) document.getElementById("cfgNama").value = CONFIG.namaMarketing || "";
    if(document.getElementById("cfgJabatan")) document.getElementById("cfgJabatan").value = CONFIG.jabatan || "";
    if(document.getElementById("cfgWA")) document.getElementById("cfgWA").value = CONFIG.nomorWA || "";
    if(document.getElementById("cfgEmail")) document.getElementById("cfgEmail").value = CONFIG.email || "";
    if(document.getElementById("cfgFoto")) document.getElementById("cfgFoto").value = CONFIG.fotoProfil || "";
    if (CONFIG.fotoProfil && document.getElementById("previewFotoProfil")) {
      document.getElementById("previewFotoProfil").src = CONFIG.fotoProfil;
      document.getElementById("previewProfilWrap").classList.remove("hidden");
    }
  }
}

function renderAdminTable() {
  const tbody = document.getElementById("adminPropTable");
  if (!tbody) return;
  document.getElementById("propCountBadge").innerText = `${propertiesData.length} Total`;
  tbody.innerHTML = "";

  if (propertiesData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500">Belum ada properti. Silakan tambah properti di atas.</td></tr>`;
    return;
  }

  propertiesData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/80 border-b border-slate-700/50";
    tr.innerHTML = `
      <td class="p-3">
        <img src="${item.gambar || 'https://via.placeholder.com/150'}" class="w-12 h-12 object-cover rounded-lg border border-slate-700" alt="thumb">
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-200">${item.nama}</div>
        <div class="text-[10px] text-slate-400">${item.developer}</div>
      </td>
      <td class="p-3">
        <div class="text-slate-300">${item.lokasi}</div>
        <span class="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">${item.tipe}</span>
      </td>
      <td class="p-3 font-semibold text-emerald-400">Rp ${Number(item.harga).toLocaleString('id-ID')}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 text-[10px] rounded ${item.status === 'Ready Stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${item.status}</span>
      </td>
      <td class="p-3 text-center">
        <div class="flex justify-center gap-2">
          <button type="button" onclick="editProperty(${index})" class="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded"><i class="fa-solid fa-pen"></i></button>
          <button type="button" onclick="deleteProperty(${index})" class="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// PROSES SIMPAN PROPERTI (BEBAS ERROR HIDDEN INPUT)
function handleSaveProperty(e) {
  e.preventDefault();
  
  const editId = document.getElementById("propEditId").value;
  const gambarInput = document.getElementById("propGambar").value;

  if (!gambarInput) {
    alert("Mohon upload / pilih foto utama terlebih dahulu!");
    return;
  }

  const newItem = {
    id: editId !== "" ? propertiesData[editId].id : Date.now(),
    nama: document.getElementById("propNama").value,
    developer: document.getElementById("propDeveloper").value,
    lokasi: document.getElementById("propLokasi").value,
    alamat: document.getElementById("propAlamat").value,
    tipe: document.getElementById("propTipe").value,
    harga: Number(document.getElementById("propHarga").value) || 0,
    status: document.getElementById("propStatus").value,
    luasTanah: Number(document.getElementById("propLT").value) || 0,
    luasBangunan: Number(document.getElementById("propLB").value) || 0,
    kamarTidur: Number(document.getElementById("propKT").value) || 0,
    kamarMandi: Number(document.getElementById("propKM").value) || 0,
    gambar: gambarInput,
    video: document.getElementById("propVideo").value || "",
    deskripsi: document.getElementById("propDeskripsi").value
  };

  if (editId !== "") {
    propertiesData[editId] = newItem;
  } else {
    propertiesData.unshift(newItem);
  }

  localStorage.setItem("PROPERTIES_DATA", JSON.stringify(propertiesData));
  resetPropForm();
  renderAdminTable();
  alert("✨ Properti berhasil disimpan dan terbit di website utama!");
}

function editProperty(index) {
  const item = propertiesData[index];
  document.getElementById("propEditId").value = index;
  document.getElementById("propNama").value = item.nama;
  document.getElementById("propDeveloper").value = item.developer;
  document.getElementById("propLokasi").value = item.lokasi;
  document.getElementById("propAlamat").value = item.alamat;
  document.getElementById("propTipe").value = item.tipe;
  document.getElementById("propHarga").value = item.harga;
  document.getElementById("propStatus").value = item.status;
  document.getElementById("propLT").value = item.luasTanah;
  document.getElementById("propLB").value = item.luasBangunan;
  document.getElementById("propKT").value = item.kamarTidur;
  document.getElementById("propKM").value = item.kamarMandi;
  
  document.getElementById("propGambar").value = item.gambar || "";
  if (item.gambar) {
    document.getElementById("previewGambar").src = item.gambar;
    document.getElementById("previewGambarWrap").classList.remove("hidden");
  }

  document.getElementById("propVideo").value = item.video || "";
  if (item.video) {
    document.getElementById("previewVideo").src = item.video;
    document.getElementById("previewVideoWrap").classList.remove("hidden");
  }

  document.getElementById("propDeskripsi").value = item.deskripsi;
  document.getElementById("formPropertyTitle").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Properti`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProperty(index) {
  if (confirm("Apakah Anda yakin ingin menghapus properti ini?")) {
    propertiesData.splice(index, 1);
    localStorage.setItem("PROPERTIES_DATA", JSON.stringify(propertiesData));
    renderAdminTable();
  }
}

function resetPropForm() {
  document.getElementById("propertyForm").reset();
  document.getElementById("propEditId").value = "";
  document.getElementById("propGambar").value = "";
  document.getElementById("propVideo").value = "";
  document.getElementById("previewGambarWrap").classList.add("hidden");
  document.getElementById("previewVideoWrap").classList.add("hidden");
  document.getElementById("formPropertyTitle").innerHTML = `<i class="fa-solid fa-circle-plus"></i> Tambah Properti Baru`;
}

function handleSaveConfig(e) {
  e.preventDefault();
  CONFIG.namaMarketing = document.getElementById("cfgNama").value;
  CONFIG.jabatan = document.getElementById("cfgJabatan").value;
  CONFIG.nomorWA = document.getElementById("cfgWA").value;
  CONFIG.email = document.getElementById("cfgEmail").value;
  CONFIG.fotoProfil = document.getElementById("cfgFoto").value;

  localStorage.setItem("CONFIG_OVERRIDE", JSON.stringify(CONFIG));
  alert("Informasi Profil Sales & Foto Landing Page berhasil diperbarui!");
}

function switchTab(tab) {
  if (tab === 'properti') {
    document.getElementById("tabPropertiContent").classList.remove("hidden");
    document.getElementById("tabProfileContent").classList.add("hidden");
    document.getElementById("tabBtnProperti").className = "pb-3 border-b-2 border-blue-500 text-blue-400 font-semibold text-sm flex items-center gap-2";
    document.getElementById("tabBtnProfile").className = "pb-3 border-b-2 border-transparent text-slate-400 font-semibold text-sm hover:text-slate-200 flex items-center gap-2";
  } else {
    document.getElementById("tabPropertiContent").classList.add("hidden");
    document.getElementById("tabProfileContent").classList.remove("hidden");
    document.getElementById("tabBtnProfile").className = "pb-3 border-b-2 border-blue-500 text-blue-400 font-semibold text-sm flex items-center gap-2";
    document.getElementById("tabBtnProperti").className = "pb-3 border-b-2 border-transparent text-slate-400 font-semibold text-sm hover:text-slate-200 flex items-center gap-2";
  }
}

// LISTENERS UPLOAD FILE DARI LAPTOP/HP
document.addEventListener("DOMContentLoaded", () => {
  const fGambar = document.getElementById('fileGambar');
  if(fGambar) {
    fGambar.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('propGambar').value = evt.target.result;
          document.getElementById('previewGambar').src = evt.target.result;
          document.getElementById('previewGambarWrap').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const fVideo = document.getElementById('fileVideo');
  if(fVideo) {
    fVideo.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          alert("Ukuran video terlalu besar (Maksimal 15MB).");
          this.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('propVideo').value = evt.target.result;
          document.getElementById('previewVideo').src = evt.target.result;
          document.getElementById('previewVideoWrap').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const fProfil = document.getElementById('fileFotoProfil');
  if(fProfil) {
    fProfil.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('cfgFoto').value = evt.target.result;
          document.getElementById('previewFotoProfil').src = evt.target.result;
          document.getElementById('previewProfilWrap').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }
});