#!/usr/bin/env python3
"""FSA Lab — review_why_data.py (Builder F, Round 7)

Satu kalimat "kenapa kunci benar" per soal bank review, urutan = urutan bank
(gi 0..184: modul 1..37, tiap modul 5 soal sesuai urutan var QUIZ di js/modulN.js).

Dipakai tools/gen_review_bank.py -> field "why" di js/review-bank.js.
review/index.html menampilkannya saat jawaban SALAH ("Kenapa: ...").

Aturan tulis: 1 kalimat, rujuk ISI kunci (bukan huruf opsi — opsi bank di-shuffle),
tanpa karakter < > & mentah.
"""

WHY = [
# ---------------- M1 (gi 0-4) ----------------
"Setelah renumbering efektif 1 Jan 2024, PSAK 73 (sewa) menjadi PSAK 116.",
"Laba naik tapi tak menjadi kas dan selisihnya melebar = laba ditopang akrual, bukan kas.",
"Depresiasi hanya alokasi biaya non-kas — tak ada kas keluar maupun masuk.",
"Kreditur dibayar dari kas, bukan dari pertumbuhan penjualan atau harga saham.",
"Current ratio = aset lancar dibagi liabilitas lancar.",
# ---------------- M2 (gi 5-9) ----------------
"Beneish M-score dirancang mendeteksi pola angka khas manipulasi laba.",
"DSO naik 23 hari = pelanggan membayar makin lama, tanda penagihan melambat.",
"Setelah renumbering, PSAK 72 (pendapatan) menjadi PSAK 115.",
"Rasio di bawah 1 dan terus turun = porsi laba yang menjadi kas menyusut.",
"Beban yang dikapitalisasi tak lagi mengurangi laba (menjadi aset), tapi kas yang keluar tetap sama.",
# ---------------- M3 (gi 10-14) ----------------
"Gross margin = 1 dikurangi HPP/penjualan; HPP turun 66% ke 65% menaikkan margin 34% ke 35%.",
"Identitas DuPont: ROE = ROA x leverage; selisih sebesar itu hanya bisa dijelaskan aset 2,6x ekuitas.",
"Buyback mengecilkan ekuitas (penyebut ROE) tanpa mengubah operasi — ROE naik secara mekanis.",
"ROIC di atas biaya modal = tiap rupiah modal menghasilkan lebih dari biayanya.",
"Common-size menyamakan skala (persen dari penjualan/aset) sehingga struktur biaya bisa dibandingkan.",
# ---------------- M4 (gi 15-19) ----------------
"CCC naik 18 hari = kas mengendap 18 hari lebih lama di siklus operasi.",
"DSO naik = koleksi piutang melambat; waspadai penjualan yang dipaksakan ke pelanggan lemah.",
"Menagih piutang melepaskan kas yang terikat tanpa menambah utang.",
"Menunda bayar supplier memang menurunkan CCC dan menaikkan CFO — tapi bisa menyembunyikan tekanan likuiditas.",
"Modal kerja = aset lancar dikurangi liabilitas lancar; positif berarti aset lancar lebih besar.",
# ---------------- M5 (gi 20-24) ----------------
"Current ratio = aset lancar dibagi liabilitas lancar.",
"Quick ratio mengecualikan persediaan karena paling tidak likuid di antara aset lancar.",
"D/E naik = proporsi utang terhadap ekuitas naik, bantalan kreditur menipis.",
"Laba operasi kurang dari 2 kali beban bunga = sedikit ruang sebelum gagal bayar bunga.",
"Rasio ini dibaca sebagai jumlah tahun yang dibutuhkan untuk melunasi utang neto dari EBITDA.",
# ---------------- M6 (gi 25-29) ----------------
"FCFF mengukur kas untuk semua pemberi modal: CFO dinormalisasi dari beban bunga setelah pajak, dikurangi capex.",
"FCFF negatif hanya berarti kas keluar melebihi kas masuk — bisa ekspansi sehat atau pemborosan.",
"FCFE = FCFF dikurangi arus ke kreditur (bunga setelah pajak dan pembayaran pokok neto); sisanya milik pemegang saham.",
"Memotong capex menaikkan FCFF hari ini tapi mengorbankan kapasitas tumbuh esok.",
"Dividen yang bertahun-tahun melebihi kas milik pemegang saham pasti didanai dari luar operasi.",
# ---------------- M7 (gi 30-34) ----------------
"Wajar tanpa modifikasian berarti tak ada salah saji material — bukan jaminan angka 100% benar.",
"KAM adalah area berisiko dan pertimbangan signifikan yang paling menyita perhatian auditor.",
"ECL dan impairment penuh asumsi manajemen ke depan — paling mudah dipakai memoles laba.",
"Paragraf going concern mempertanyakan kelangsungan usaha — analis harus menguji kas dan jadwal utang sendiri.",
"Transaksi afiliasi rawan tidak wajar (tunneling) — lensa forensik yang utama.",
# ---------------- M8 (gi 35-39) ----------------
"DuPont 5 langkah = tax burden x interest burden x margin EBIT x perputaran aset x leverage.",
"Tax burden = laba bersih dibagi PBT; 78% berarti pajak memakan 22% dari PBT.",
"Margin ritel 15,0% di atas distribusi 12,1% — perbandingan apel-ke-apel antar segmen.",
"Interest burden = PBT dibagi EBIT; turun berarti bunga memakan porsi laba yang lebih besar.",
"Segmen menunjukkan unit mana menciptakan vs menghancurkan nilai — dasar alokasi modal.",
# ---------------- M9 (gi 40-44) ----------------
"EPS dasar = laba bersih dibagi saham beredar.",
"Continuing EPS mengeluarkan one-off jual aset 8.000 agar mencerminkan laba berulang.",
"Piutang tumbuh jauh lebih cepat dari penjualan = kas belum mengikuti pengakuan pendapatan.",
"Tanpa opsi atau saham konversi tak ada tambahan saham potensial yang mengencerkan.",
"Valuasi butuh laba yang berulang — one-off dikeluarkan agar tak membayar mahal untuk laba sekali jadi.",
# ---------------- M10 (gi 45-49) ----------------
"Metode langsung menyusun arus kas dari penerimaan dan pembayaran kas; tak langsung merekonsiliasi dari laba.",
"Kas dari pelanggan = penjualan dikurangi kenaikan piutang.",
"Capex melebihi kas operasi = investasi didanai dari luar operasi (utang atau kas cadangan).",
"Arus kas pendanaan naik karena penarikan utang neto 11.440 melebihi dividen 6.000.",
"FCFE negatif 5.760 = kas milik pemegang saham tekor; dividen 6.000 pasti didanai utang.",
# ---------------- M11 (gi 50-54) ----------------
"Rasio ECL = cadangan kerugian dibagi piutang bruto.",
"FIFO memakai HPP dari pembelian lama yang lebih murah — laba terlihat lebih tinggi.",
"Stage 3 = aset sudah credit-impaired (gagal bayar).",
"Lonjakan cadangan bisa antisipasi jujur — atau big bath sekalian.",
"PSAK 109 memakai expected credit loss: cadangan dibentuk sebelum rugi benar-benar terjadi.",
# ---------------- M12 (gi 55-59) ----------------
"Impairment diakui saat nilai terpulihkan di bawah nilai tercatat — aset jangan dibawa di atas nilainya.",
"Surplus revaluasi aset tetap masuk OCI (bukan laba rugi), menaikkan ekuitas.",
"PSAK 116 mewajibkan penyewa mengakui aset hak-guna dan liabilitas sewa.",
"Investasi neto positif bertahun-tahun = kapasitas bertambah (ekspansi).",
"Separuh lebih aset berupa aset tetap = bisnis padat modal.",
# ---------------- M13 (gi 60-64) ----------------
"Cressey: tekanan + kesempatan + rasionalisasi — ketiganya perlu ada.",
"Skor di atas (kurang negatif dari) batas -1,78 = zona flag manipulasi.",
"DSRI = pertumbuhan rasio piutang/penjualan; di atas 1 = piutang tumbuh lebih cepat dari penjualan.",
"Pendapatan prematur atau fiktif adalah skema manipulasi laporan paling umum.",
"Skeptisisme profesional = menuntut bukti sebelum percaya, bukan curiga buta.",
# ---------------- M14 (gi 65-69) ----------------
"PSAK (ikut IFRS) melarang LIFO; hanya FIFO dan rata-rata.",
"US GAAP melarang pembalikan impairment — beda dengan PSAK/IFRS.",
"US GAAP mengklasifikasikan bunga dibayar sebagai arus kas operasi.",
"US GAAP membebankan biaya pengembangan — tidak dikapitalisasi.",
"Beda standar mengubah angka yang dilaporkan — analis harus menormalisasi sebelum membandingkan.",
# ---------------- M15 (gi 70-74) ----------------
"Cut-off Z': aman di atas 2,90, distress di bawah 1,23 — 2,26 jatuh di grey zone.",
"Koefisien X3 (EBIT/aset) 3,107 adalah yang terbesar di formula Z'.",
"Di bawah 1,23 = zona distress menurut Altman.",
"Input Z-Score adalah angka akuntansi — bisa dipoles manajemen.",
"Kreditur menjaga leverage (D/E maksimum) dan kemampuan bayar (coverage minimum).",
# ---------------- M16 (gi 75-79) ----------------
"Fair Value Through Profit or Loss = diukur pada nilai wajar, selisihnya ke laba rugi.",
"Stage 3 = sudah ada bukti objektif gagal bayar (credit-impaired).",
"Incurred loss menunggu rugi terjadi; ECL mencadangkan ekspektasi rugi ke depan.",
"Kategori instrumen keuangan hanya boleh berubah bila model bisnis benar-benar berubah.",
"Perubahan nilai wajar langsung ke laba rugi — laba jadi berayun mengikuti pasar.",
# ---------------- M17 (gi 80-84) ----------------
"Sloan = (NI dikurangi CFO) dibagi aset; 3,2% = akrual moderat, belum zona bahaya.",
"Akrual tinggi terus-menerus = laba tak didukung kas — kualitas rendah.",
"Kasus Garuda berpusat pada pengakuan piutang Mahata yang dipaksakan.",
"Enron menyembunyikan utang di entitas off-balance-sheet (SPE).",
"Verifikasi bukti sebelum percaya — itulah skeptisisme profesional.",
# ---------------- M18 (gi 85-89) ----------------
"Penjualan adalah penggerak utama — hampir semua pos lain diturunkan darinya.",
"Nilai kini arus kas abadi tumbuh g = FCFF dibagi (WACC dikurangi g).",
"Diskonto lebih besar = nilai kini lebih kecil.",
"Beli di bawah nilai wajar agar kesalahan valuasi tak berakibat fatal.",
"Forecast = skenario berdasar asumsi eksplisit, bukan ramalan pasti.",
# ---------------- M19 (gi 90-94) ----------------
"10-K = laporan tahunan emiten AS yang diaudit (kuartalan = 10-Q).",
"8-K = laporan peristiwa material terkini — paling cepat tersedia.",
"Proxy DEF 14A memuat kompensasi eksekutif dan transaksi pihak berelasi.",
"Laporan auditan emiten Indonesia diunduh dari situs resmi BEI, idx.co.id.",
"XBRL via data.sec.gov = data filing SEC yang mesin-terbaca untuk diolah.",
# ---------------- M20 (gi 95-99) ----------------
"Goodwill = selisih lebih harga akuisisi atas nilai wajar aset neto teridentifikasi.",
"Goodwill tidak diamortisasi — diuji penurunan nilai minimal setahun sekali.",
"Aset takberwujud berumur terbatas diamortisasi selama umur manfaatnya.",
"Rugi impairment goodwill tidak boleh dibalik — di PSAK maupun US GAAP.",
"Goodwill bukan aset yang bisa dijual bayar utang — kreditur mengurangkannya dari tangible net worth.",
# ---------------- M21 (gi 100-104) ----------------
"PSAK/IFRS berbasis prinsip (judgment), US GAAP berbasis aturan rinci.",
"PSAK 237: kewajiban kini + arus keluar probable + estimasi andal — ketiganya wajib.",
"Kewajiban possible (bukan probable) tidak diakui — cukup diungkap sebagai kontinjensi.",
"Tanpa titik terbaik, US GAAP memakai ujung bawah rentang (konservatif).",
"Provisi kontrak memberatkan = biaya tak terhindarkan yang melebihi manfaat ekonomik kontrak.",
# ---------------- M22 (gi 105-109) ----------------
"PSAK 224 (dulu PSAK 7) mengatur pengungkapan pihak berelasi — bukan pengakuan.",
"Tunneling = laba dipindah ke afiliasi via harga tidak wajar.",
"Piutang berelasi tumbuh jauh lebih cepat dari penjualannya = kas tak mengikuti — pola tunneling.",
"Bunga di bawah pasar = subsidi tersembunyi untuk pengendali.",
"Jaminan silang membuat kewajiban afiliasi bisa jatuh ke perusahaan tanpa tercatat di neraca.",
# ---------------- M23 (gi 110-114) ----------------
"Maintenance covenant diuji berkala selama fasilitas berjalan (berbeda dengan incurrence).",
"0,91× < 1,25× = BREACH definisi kontrak (konservatif). Bukan berarti kas tak cukup: 30.800 vs pokok 20.000 = 1,54x (cukup). Breach = technical default — bank berhak acceleration atau waiver berbayar.",
"Pelanggaran covenant memberi kreditur hak mempercepat pelunasan atau meminta waiver berbayar.",
"Perjanjian kredit mendefinisikan angkanya sendiri — angka laporan tak otomatis berlaku.",
"Di ambang breach, manajemen punya insentif memoles laba — sisi pressure dari fraud triangle.",
# ---------------- M24 (gi 115-119) ----------------
"EV = market cap + utang neto = harga untuk membeli seluruh perusahaan.",
"P/E dengan laba negatif tak bermakna — pembilang dan penyebut bertanda beda.",
"LIFO (GAAP) vs FIFO (PSAK) mengubah laba — normalisasi dulu sebelum bandingkan multiple.",
"PEG di bawah 1 = murah relatif terhadap pertumbuhan — tapi hanya sebagus forecast-nya.",
"Revaluasi menaikkan ekuitas (penyebut P/B) tanpa mengubah bisnis — terlihat murah semu.",
# ---------------- M25 (gi 120-124) ----------------
"Skor agregat tak menghapus peringatan komponen — akrual 14.440 wajib diselidiki.",
"Piotroski: 7-9 = general strength, 4-6 = abu-abu, 0-3 = lemah.",
"2,26 berada di antara 1,23 dan 2,90 = grey zone: belum aman, belum distress.",
"Z' mengganti market value di X4 dengan nilai buku ekuitas dibagi total liabilitas — cocok untuk perusahaan tak tercatat.",
"Jones memisahkan akrual diskresioner via regresi terhadap perubahan pendapatan dan PPE.",
# ---------------- M26 (gi 125-129) ----------------
"Setelah renumbering syariah efektif 1 Jan 2024, PSAK 101 (penyajian) menjadi PSAK 401.",
"Margin murabahah diakui proporsional selama akad (akrual) — bukan sekaligus di awal.",
"Tanpa kelalaian, kerugian finansial mudharabah ditanggung shahibul maal (bank).",
"Ijarah memindahkan manfaat pakai tanpa bunga; kepemilikan tetap pada lessor.",
"Imbal hasil sukuk ijarah berasal dari sewa aset underlying — bukan bunga utang.",
# ---------------- M27 (gi 130-134) ----------------
"Fakta kanonis: Cemerlang tak punya ESOP — contoh opsi murni ilustrasi latihan.",
"Beban share-based payment diakui selama vesting berdasar fair value saat grant.",
"Dilusi maksimum = 45.240 dibagi 105 = 430,9 (tanpa treasury stock method).",
"Treasury stock method mengasumsikan proceeds exercise dipakai buyback — tambahan saham bersih lebih kecil.",
"POJK 51 mewajibkan emiten dan LJK menyusun RAKB dan laporan keberlanjutan.",
# ---------------- M28 (gi 135-139) ----------------
"Kalimat makin panjang + tone defensif = pola pengaburan — sinyal investigasi, bukan vonis.",
"Benford valid untuk populasi besar angka natural; tidak untuk nomor urut atau kode tetap.",
"Pisahkan dulu klaim faktual dari opini sebelum bereaksi terhadap short-seller report.",
"Mulai dari kebijakan akuntansi — apa yang berubah menentukan cara membaca seluruh catatan.",
"Opini WTP konsisten tanpa paragraf penekanan = dokumen bersih, bukan red flag.",
# ---------------- M29 (gi 140-144) ----------------
"Hedge accounting di Indonesia diatur PSAK 109 (dulu 71), setara IFRS 9.",
"Net ke P&L = swap gain 5.000 dikurangi rugi FX utang 4.600 = 400.",
"Bagian efektif cash flow hedge ditampung di OCI sampai item yang dilindungi memengaruhi P&L.",
"PSAK 109 tak mensyaratkan nilai nosional minimum — syaratnya dokumentasi, desainasi, efektivitas.",
"Saldo cadangan hedge tetap di OCI sampai transaksi yang dilindungi terealisasi ke P&L.",
# ---------------- M30 (gi 145-149) ----------------
"LDR = kredit dibagi DPK; 88,2% berarti hampir semua DPK tersalurkan tapi masih ada ruang.",
"Coverage memakai total CKPN (termasuk Stage 1 dan 2), sedangkan NPL net hanya mengurangkan CKPN kredit bermasalah.",
"Stage 3 = credit-impaired dengan ECL lifetime penuh — migrasi menaikkan beban CKPN.",
"Deposito lebih mahal dari CASA — biaya dana naik menggerus NIM.",
"Restrukturisasi yang lancar bukan NPL, tapi wajib dipantau terpisah karena risikonya lebih tinggi.",
# ---------------- M31 (gi 150-154) ----------------
"Bunga sirkular saat utang berubah: bunga butuh rata-rata utang, rata-rata utang butuh kas, kas butuh laba, laba butuh bunga.",
"Piutang = DSO/365 x penjualan = 73/365 x 582.400 = 116.480.",
"Laba tetap tapi kas turun 15.956 = pelajaran laba bukan kas.",
"Capex 50.000 dikurangi depresiasi 32.000 = +18.000, jadi aset tetap neto 230.000 + 18.000 = 248.000.",
"Utang tetap tapi ekuitas naik dari laba ditahan — leverage membaik tanpa bayar utang.",
# ---------------- M32 (gi 155-159) ----------------
"PKP = 58.000 + 4.000 - 4.000 - 6.000 = 52.000.",
"Beda beban pajak akuntansi vs PPh terutang = pajak tangguhan (pembalikan DTA).",
"Pendapatan sewa gedung kena PPh final 10% (Pasal 4 ayat 2).",
"Urutan formal: keberatan, banding, peninjauan kembali.",
"Usaha kecil tanpa akuntabilitas publik memakai SAK EMKM.",
# ---------------- M33 (gi 160-164) ----------------
"idAAA = peringkat tertinggi skala nasional PEFINDO — relatif terhadap obligor Indonesia.",
"Di kerangka Merton, ekuitas = call option dengan strike = nilai nominal utang jatuh tempo.",
"PKPU sementara maksimal 45 hari menurut UU 37/2004.",
"DSCR 1,35x = kas tersedia 1,35 kali kewajiban cicilan periode itu.",
"Sisa untuk subordinasi = (260.000 - 200.000) dibagi 150.000 = 40%.",
# ---------------- M34 (gi 165-169) ----------------
"Kas diterima sebelum kewajiban dipenuhi = liabilitas kontrak, bukan pendapatan.",
"Alokasi = 120.000 x 20.000 dibagi 135.000 = 17.778 (proporsional SSP).",
"Distributor yang tak mengendalikan tiket = agen — hanya komisi yang diakui.",
"17.778 x 10/24 = 7.407 (Mar-Des 2026 = 10 bulan dari 24 bulan).",
"Pendapatan naik tapi kas tak mengikuti = red flag pengakuan prematur.",
# ---------------- M35 (gi 170-174) ----------------
"Induk menggabung 100% aset/liabilitas anak; 20% sisanya = NCI.",
"NCI atas laba = 12.000 x 20% = 2.400.",
"Dividen dari asosiasi mengurangi nilai tercatat investasi (metode ekuitas) — bukan pendapatan.",
"(42.000 - 2.400) - 10.000 = 29.600; downstream dieliminasi penuh ke induk.",
"Piutang-utang internal saling hapus — total aset konsolidasian turun 15.000.",
# ---------------- M36 (gi 175-179) ----------------
"PSAK 102 (dulu 53): beban SBC diakui selama periode vesting, mengikuti jasa karyawan — 9.000 / 3 = 3.000.",
"Jurnal SBC tahunan: Dr beban kompensasi 3.000 / Cr agio saham 3.000 — kas belum bergerak.",
"Treasury stock method: 24 - (24 x 200 / 400) = 12 juta saham dilutif tambahan.",
"P/E konservatif memakai diluted EPS 283: 6.000 / 283 = 21,2x, bukan 20,0x.",
"Opsi out-of-the-money bersifat anti-dilutif — PSAK 233 mengeluarkannya dari diluted EPS.",
# ---------------- M37 (gi 180-184) ----------------
"PSAK 202 (dulu 14) melarang LIFO; persediaan hanya boleh FIFO atau rata-rata tertimbang.",
"LIFO reserve 2.000 = selisih persediaan FIFO-LIFO; tambah 2.000 untuk menyetarakan ke FIFO.",
"Recoverable amount = nilai TERTINGGI: max(18.000, 20.000) = 20.000.",
"Rugi impairment goodwill TIDAK BOLEH dibalik dalam kondisi apa pun (PSAK 236).",
"Kapitalisasi 8.000/4 thn = beban 2.000/thn; laba tahun 1 lebih tinggi 6.000 vs beban langsung.",
# ---------------- M38 (gi 185-189) ----------------
"Laporan interim bersifat kumulatif YTD — IS enam bulan berakhir 30 Juni mencakup 1 Jan sampai 30 Jun.",
"Revenue Q2 = 290.000 dikurangi 135.000 = 155.000 — flow boleh dikurangkan bila basis selaras.",
"H1 dikurangi Q1 hanya valid untuk flow; kas (stock) dan rasio tidak boleh dikurangkan langsung.",
"NIM annualisasi = NII H1 dikali 2 dibagi rata-rata earning assets = 6,00 persen.",
"Rasio adalah hasil bagi — margin Q2 harus dihitung ulang dari komponennya, bukan dari selisih margin."
]
