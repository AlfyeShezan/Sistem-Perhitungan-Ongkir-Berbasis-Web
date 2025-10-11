// script.js

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Smooth scroll ke form cek ongkir
function scrollToForm() {
    document.getElementById('cek-ongkir').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll untuk semua link di navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Tutup menu mobile jika terbuka
            document.getElementById('navMenu').classList.remove('active');
        }
    });
});

// Fungsi menampilkan alert
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 4000);
}

// Format angka ke rupiah
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Mapping jarak antar kota di Provinsi Yogyakarta
const jarakKota = {
    "Kota Yogyakarta": { "Kota Yogyakarta": 10, "Sleman": 15, "Bantul": 25, "Gunungkidul": 45, "Kulonprogo": 35 },
    "Sleman": { "Kota Yogyakarta": 15, "Sleman": 10, "Bantul": 30, "Gunungkidul": 50, "Kulonprogo": 40 },
    "Bantul": { "Kota Yogyakarta": 25, "Sleman": 30, "Bantul": 10, "Gunungkidul": 45, "Kulonprogo": 50 },
    "Gunungkidul": { "Kota Yogyakarta": 45, "Sleman": 50, "Bantul": 45, "Gunungkidul": 10, "Kulonprogo": 60 },
    "Kulonprogo": { "Kota Yogyakarta": 35, "Sleman": 40, "Bantul": 50, "Gunungkidul": 60, "Kulonprogo": 10 }
};

// Fungsi hitung ongkir berdasarkan jarak
function hitungOngkir(kotaAsal, kotaTujuan, berat) {
    if (!jarakKota[kotaAsal] || jarakKota[kotaAsal][kotaTujuan] === undefined) {
        return null; // kota tidak tersedia
    }

    const jarak = jarakKota[kotaAsal][kotaTujuan];
    let tarifPerKg;

    if (jarak > 40) {
        tarifPerKg = 12000;
    } else if (jarak >= 30) {
        tarifPerKg = 8000;
    } else {
        tarifPerKg = 5000;
    }

    return berat * tarifPerKg;
}

// Event listener form cek ongkir
document.getElementById('ongkirForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const kotaAsal = document.getElementById('kotaAsal').value;
    const kotaTujuan = document.getElementById('kotaTujuan').value;
    const beratPaket = parseFloat(document.getElementById('beratPaket').value);
    
    // Validasi input
    if (!kotaAsal || !kotaTujuan || !beratPaket) {
        showAlert('Mohon lengkapi semua data!', 'error');
        return;
    }
    
    if (beratPaket < 1) {
        showAlert('Masukkan berat minimal 1 kg', 'error');
        return;
    }
    
    // Tampilkan loader
    document.getElementById('resultCard').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    
    setTimeout(() => {
        const totalOngkir = hitungOngkir(kotaAsal, kotaTujuan, beratPaket);

        if (totalOngkir === null) {
            showAlert('Kota tujuan tidak tersedia di provinsi Yogyakarta', 'error');
            document.getElementById('loader').style.display = 'none';
            return;
        }

        // Simulasi response JSON
        const response = {
            kota_asal: kotaAsal,
            kota_tujuan: kotaTujuan,
            berat: beratPaket,
            total_ongkir: totalOngkir
        };
        
        // Hide loader
        document.getElementById('loader').style.display = 'none';
        
        // Tampilkan hasil
        document.getElementById('resultAsal').textContent = response.kota_asal;
        document.getElementById('resultTujuan').textContent = response.kota_tujuan;
        document.getElementById('resultBerat').textContent = response.berat + ' kg';
        document.getElementById('resultTotal').textContent = formatRupiah(response.total_ongkir);
        
        const resultCard = document.getElementById('resultCard');
        resultCard.style.display = 'block';
        
        // Smooth scroll ke hasil
        setTimeout(() => {
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    }, 1500); // Simulasi loading
});

// Event listener form kontak
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const pesan = document.getElementById('pesan').value;
    
    if (!nama || !whatsapp || !pesan) {
        showAlert('Mohon lengkapi semua data!', 'error');
        return;
    }
    
    alert('Pesan berhasil dikirim!');
    
    this.reset();
});
