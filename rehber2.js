// REHBER UYGULAMASININ CLASS KULLANARAK YAPILMASI

class Kisi{
    constructor(ad, soyad, no) {
        this.ad = ad;
        this.soyad = soyad;
        this.no = no;
    }
}

class Util{
    static bosAlanKontrolEt(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if(alan.length === 0) {
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }

    static noGecerliMi(no) {
        const telNo = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return telNo.test(no);
    }
}

class Ekran {
    constructor() {
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.no = document.getElementById('no');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit', this.kaydetGuncelle.bind(this));
        //bind -> sen this kullanırsan o şu anki objeyi ekran objesini temsil etsin.
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil.bind(this));
        // update ve delete butonlarına basıldıgında ilgili tr elemanı burada tutuldu
        this.secilenSatir = undefined;
        this.depo = new Depo();
        this.kisileriEkranaYazdir();

    }

    bilgiOlustur(mesaj, durum) {
        const uyariDivi = document.querySelector('.bilgi');
        uyariDivi.innerHTML = mesaj;

        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');
        
        // setTimeOut -> verilen süre sonunda(ex. 2 milisn sonra) git bu kodu calıstır
        // setInterval -> verilen sürede bir(ex. 2 milisnde bir) bu kodu calıstır.
        setTimeout(function() {
            uyariDivi.className = 'bilgi';
        },2000);
    }

    alanlariTemizle() {
        this.ad.value = '';
        this.soyad.value = '';
        this.no.value = '';
    }

    guncelleVeyaSil(e) {
        const tiklanmaYeri = e.target;

        if(tiklanmaYeri.classList.contains('btn--delete')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();
            this.ekleGuncelleButon.value = 'Kaydet';
        } else if(tiklanmaYeri.classList.contains('btn--edit')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.ekleGuncelleButon.value = 'Güncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.no.value = this.secilenSatir.cells[2].textContent;

        }
      console.log(this);  
    }
    
    kisiyiEkrandaGunelle(kisi) {

        const sonuc = this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);
        if(sonuc) {

            this.secilenSatir.cells[0].textContent = kisi.ad;
            this.secilenSatir.cells[1].textContent = kisi.soyad;
            this.secilenSatir.cells[2].textContent = kisi.no;

            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'Kaydet';
            this.bilgiOlustur('Kişi Güncellendi', true);

        } else {
            this.bilgiOlustur('Yazılan Numara Kullanımda', false);
        }
   
    }

    kisiyiEkrandanSil() {
        this.secilenSatir.remove();
        const silinecekNo = this.secilenSatir.cells[2].textContent;
        this.depo.kisiSil(silinecekNo);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi Rehberden Silindi', true);
    }
    kisileriEkranaYazdir() {
        this.depo.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);
        });
    }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.no}</td>
        <td>
            <button class="btn btn--edit"><i class="fa-regular fa-edit"></i> </button>
            <button class="btn btn--delete"><i class="fa-regular fa-trash-can"></i> </button>
        </td>`;
        this.kisiListesi.appendChild(olusturulanTr);
    }
    kaydetGuncelle(e) {
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.no.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.no);
        const noGecerliMi = Util.noGecerliMi(this.no.value);
        console.log(this.no.value + "için no kontrolü" + noGecerliMi);

        // tüm alanlar doldurulmuş
        if(sonuc) {

            if(!noGecerliMi) {
                this.bilgiOlustur('Lütfen Geçerli Bir Numara Yazınız', false);
                return;
            }

            if(this.secilenSatir) {
                // secilen satır undefined degilse güncellenecek.
                this.kisiyiEkrandaGunelle(kisi);


            } 
            else {
                // secilen satır undefined ise ekleme yapılacak.

                
                //local storage ekle
                const sonuc = this.depo.kisiEkle(kisi);
                console.log("sonuç: " + sonuc + "kaydetgüncelle içinde");
                if(sonuc) {
                    // yeni kisiyi ekrana ekler.
                    this.bilgiOlustur('Kişi Başarıyla Eklendi', true);
                    this.kisiyiEkranaEkle(kisi);
                    this.alanlariTemizle();
                } else {
                    this.bilgiOlustur('Bu Numara Kullanımda', false);
                }
     
            }       

        } else { // bazı alanlar eksik
            this.bilgiOlustur('Lütfen Boş Alan Bırakmayınız', false);
        }
    }
}

class Depo{
    // uygulama ilk açıldığında veriler getirilir.
    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }

    noEssizMi(no) {
        const sonuc = this.tumKisiler.find(kisi => {
            return kisi.no === no;
        });

        // demekki bu numara kullanımda.
        if(sonuc) {
            console.log(no + " kullanımda");
            return false;
        } else {
            console.log(no + " kullanımda değil. ekleme yapılabilir.");
            return true;
        }
    }

    kisileriGetir() {
        let tumKisilerLocal;
        if(localStorage.getItem('tumKisiler') === null) {
            tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;
    }
    kisiEkle(kisi) {

        if(this.noEssizMi(kisi.no)) {
            // this -> o an içinde oldugun objenin içinde bulunan fonksiyonu vs. getir.
            this.tumKisiler.push(kisi);
            localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
            return true;
        } else {
            return false;
        }
        
    }
    kisiSil(no) {
        this.tumKisiler.forEach((kisi, index) => {
            if(kisi.no === no) {
                this.tumKisiler.splice(index, 1);
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }

    // güncellenmiş kisi yeni değerleri içerir
    // no kisinin bulunması için gerekli olan eski no'yu içerir
    kisiGuncelle(guncellenmisKisi, no) {

        if(guncellenmisKisi.no === no ) {

            this.tumKisiler.forEach((kisi, index) => {
                if(kisi.no === no) {
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;
                }
            });

            return true;
        }

        if(this.noEssizMi(guncellenmisKisi.no)) {
            console.log(guncellenmisKisi.no + " için kontrol. güncelleme yapılablr.");
        
            this.tumKisiler.forEach((kisi, index) => {
                if(kisi.no === no) {
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;
                }
            });

            return true;

        } else {
            console.log(guncellenmisKisi.no + " no kullanımda. güncelleme yapılamaz");
            return false;
        }


    }
    
}

document.addEventListener('DOMContentLoaded', function(e) {
    const ekran = new Ekran();
});