       // Multi-language support
        let currentLang = 'id';

        // Toggle language dropdown
        function toggleLanguageDropdown() {
            const dropdown = document.getElementById('langDropdown');
            dropdown.classList.toggle('active');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const langSwitcher = document.querySelector('.language-switcher');
            const dropdown = document.getElementById('langDropdown');
            
            if (!langSwitcher.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });

        function changeLanguage(lang) {
            currentLang = lang;
            
            // Update current language text
            document.getElementById('currentLangText').textContent = lang.toUpperCase();
            
            // Update active option
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === lang) {
                    option.classList.add('active');
                }
            });

            // Close dropdown
            document.getElementById('langDropdown').classList.remove('active');

            // Update all translatable elements
            document.querySelectorAll('[data-lang-id]').forEach(el => {
                const text = el.getAttribute(`data-lang-${lang}`);
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // For input placeholder
                    const placeholder = el.getAttribute(`data-lang-placeholder-${lang}`);
                    if (placeholder) {
                        el.placeholder = placeholder;
                    }
                } else if (el.tagName === 'OPTION') {
                    el.textContent = text;
                } else {
                    el.textContent = text;
                }
            });

            // Update hint text
            document.querySelectorAll('.hint-text').forEach(el => {
                const text = el.getAttribute(`data-lang-${lang}`);
                if (text) {
                    el.textContent = text;
                }
            });

            // Update document language
            document.documentElement.lang = lang;
        }

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

        // Validasi input berat (hanya angka dan titik desimal)
        function validateWeightInput(input) {
            // Hapus karakter non-numerik kecuali titik desimal
            let value = input.value.replace(/[^0-9.]/g, '');
            
            // Hapus titik desimal berlebihan
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            input.value = value;
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
                return null;
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

            // Pembulatan ke atas untuk berat kurang dari 1 kg
            const beratDihitung = berat < 1 ? 1 : berat;
            return Math.ceil(beratDihitung * tarifPerKg);
        }

        // Translations for alerts
        const translations = {
            id: {
                fillAllData: 'Mohon lengkapi semua data!',
                minWeight: 'Masukkan berat minimal 0.1 kg',
                maxWeight: 'Berat maksimal 1000 kg',
                invalidWeight: 'Masukkan berat yang valid (angka)',
                cityNotAvailable: 'Kota tujuan tidak tersedia di provinsi Yogyakarta',
                messageSent: 'Pesan berhasil dikirim!'
            },
            en: {
                fillAllData: 'Please complete all data!',
                minWeight: 'Enter minimum weight of 0.1 kg',
                maxWeight: 'Maximum weight 1000 kg',
                invalidWeight: 'Enter valid weight (numbers only)',
                cityNotAvailable: 'Destination city is not available in Yogyakarta province',
                messageSent: 'Message sent successfully!'
            }
        };

        // Event listener untuk validasi real-time input berat
        document.getElementById('beratPaket').addEventListener('input', function(e) {
            validateWeightInput(this);
        });

        // Event listener form cek ongkir
        document.getElementById('ongkirForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const kotaAsal = document.getElementById('kotaAsal').value;
            const kotaTujuan = document.getElementById('kotaTujuan').value;
            const beratInput = document.getElementById('beratPaket');
            const beratValue = beratInput.value.trim();
            
            // Validasi field kosong
            if (!kotaAsal || !kotaTujuan || !beratValue) {
                showAlert(translations[currentLang].fillAllData, 'error');
                return;
            }
            
            // Validasi berat adalah angka
            const beratPaket = parseFloat(beratValue);
            if (isNaN(beratPaket)) {
                showAlert(translations[currentLang].invalidWeight, 'error');
                return;
            }
            
            // Validasi rentang berat
            if (beratPaket < 0.1) {
                showAlert(translations[currentLang].minWeight, 'error');
                return;
            }
            
            if (beratPaket > 1000) {
                showAlert(translations[currentLang].maxWeight, 'error');
                return;
            }
            
            // Tampilkan loading, sembunyikan hasil sebelumnya
            document.getElementById('resultCard').style.display = 'none';
            document.getElementById('loader').style.display = 'block';
            
            // Simulasi proses loading
            setTimeout(() => {
                const totalOngkir = hitungOngkir(kotaAsal, kotaTujuan, beratPaket);

                if (totalOngkir === null) {
                    showAlert(translations[currentLang].cityNotAvailable, 'error');
                    document.getElementById('loader').style.display = 'none';
                    return;
                }

                // Tampilkan hasil
                document.getElementById('loader').style.display = 'none';
                document.getElementById('resultAsal').textContent = kotaAsal;
                document.getElementById('resultTujuan').textContent = kotaTujuan;
                document.getElementById('resultBerat').textContent = beratPaket + ' kg';
                document.getElementById('resultTotal').textContent = formatRupiah(totalOngkir);
                
                const resultCard = document.getElementById('resultCard');
                resultCard.style.display = 'block';
                
                // Scroll ke hasil
                setTimeout(() => {
                    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
                
            }, 1500); // 1.5 detik loading
        });

        // Event listener form kontak
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = document.getElementById('nama').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const pesan = document.getElementById('pesan').value;
            
            if (!nama || !whatsapp || !pesan) {
                showAlert(translations[currentLang].fillAllData, 'error');
                return;
            }
            
            alert(translations[currentLang].messageSent);
            this.reset();
        });

        // Inisialisasi hint text saat load
        document.addEventListener('DOMContentLoaded', function() {
            // Set hint text berdasarkan bahasa saat ini
            document.querySelectorAll('.hint-text').forEach(el => {
                const text = el.getAttribute(`data-lang-${currentLang}`);
                if (text) {
                    el.textContent = text;
                }
            });
            
            // Tambahkan event listener untuk input berat
            const beratInput = document.getElementById('beratPaket');
            beratInput.addEventListener('input', function() {
                validateWeightInput(this);
            });
        });
