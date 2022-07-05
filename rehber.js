// arayüz elementleri seçimi
const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const no = document.getElementById('no');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');

// event listenerların tanımlanması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

//tüm kisiler için dizi
const tumKisilerDizisi = [];
let secilenSatir = undefined;

function kisiIslemleriniYap(event) {

    if(event.target.classList.contains('btn--delete')) {
        const silinecekTr = event.target.parentElement.parentElement;
        const silinecekNo = event.target.parentElement.previousElementSibling.textContent;
        // previousElementSibling -> bir önceki komşu. 
        rehberdenSil(silinecekTr, silinecekNo);
    }
    else if(event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = 'Güncelle';
        const secilenTr = event.target.parentElement.parentElement;
        const guncellenecekNo = secilenTr.cells[2].textContent;

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        no.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;
        console.log(tumKisilerDizisi);
    }
}

function rehberdenSil(silinecekTrElement, silinecekNo) {
    silinecekTrElement.remove();
    console.log(silinecekTrElement, silinecekNo);

    /*
    // tel. noya göre silme işlemi
    tumKisilerDizisi.forEach((kisi, index) => {
        if(kisi.no === silinecekNo) {
            tumKisilerDizisi.splice(index,1);
            // splice -> islemin yapılacagı yerden kaç eleman silmek istiyorsun.
            // yeni dizi vermez oldugu yere kaydeder.
        }
    });  */

    // ELEMAN SİLMEK İÇİN 2. YÖNTEM
    const silinmeyecekKisiler = tumKisilerDizisi.filter(function(kisi, index) {
        return kisi.no !== silinecekNo;
    });
    tumKisilerDizisi.length = 0; // Diziyi basta const olarak tanımladıgımız için yeni diziyi direkt ana diziye atamadık
    tumKisilerDizisi.push(...silinmeyecekKisiler);
    bilgiOlustur('Kişi Silindi', false)

    alanlariTemizle();
    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
    
}
function kisiyiGuncelle(kisi) {
    // kisi parametresinde secilen kisinin yeni degerleri var
    // secilenSatirda da eski degerler var

    for(let i = 0; i < tumKisilerDizisi.length; i++) {
        if(tumKisilerDizisi[i].no === secilenSatir.cells[2].textContent) {
            tumKisilerDizisi[i] = kisi;
            break;
        }
    }

    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.no;

    document.querySelector('.kaydetGuncelle').value = 'Kaydet';
    // güncelleme bitince butonu eski haline getir
    secilenSatir = undefined;
    // deger ekleniyo mu güncellniyo mu anlasılması için eski haline getirdik.
    // tekrar undefined yapmazsak güncellenen elemanın üstüne ekleme yapar.

    console.log(tumKisilerDizisi);
}


function kaydet(e) {
    e.preventDefault();  
    const eklenecekVeyaGuncellenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        no: no.value
    }
    const sonuc = verileriKontrolEt(eklenecekVeyaGuncellenecekKisi);
    if(sonuc.durum) {
        if (secilenSatir) {
            // undefined degilse güncelleme yap
            kisiyiGuncelle(eklenecekVeyaGuncellenecekKisi)
        } else {
            // undefined ise kisiyi ekle
            kisiyiEkle(eklenecekVeyaGuncellenecekKisi);
        }
    }
    else{
        bilgiOlustur(sonuc.mesaj, sonuc.durum);
    }
}
function kisiyiEkle(eklenecekKisi) {

    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `<td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.no}</td>
    <td>
        <button class="btn btn--edit"><i class="fa-regular fa-edit"></i> </button>
        <button class="btn btn--delete"><i class="fa-regular fa-trash-can"></i> </button>
    </td>`;

    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekKisi);

    bilgiOlustur('Kişi Rehbere Kaydedildi', true)

}

function verileriKontrolEt(kisi) {
    // objelerde in kullanımı
    for(const deger in kisi) {
        if(kisi[deger]) {
            console.log(kisi[deger]);
        }
        else {
            return {
                durum: false,
                mesaj: 'Lütfen Bütün Kutucukları Doldurunuz!!'
            } // return ile birden fazla deger döndürmek için obje kullandık.
        }  
    }
    alanlariTemizle();
    return {
        durum: true,
        mesaj: 'Kaydedildi'
    }
}
function bilgiOlustur(mesaj, durum) {
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    if(durum) {
        olusturulanBilgi.classList.add('bilgi--success');
    } else {
        olusturulanBilgi.classList.add('bilgi--error');
    }
    // olusturulanBilgi.classList.add(durum ? 'bilgi-success' : 'bilgi--error')
    
    document.querySelector('.container').insertBefore(olusturulanBilgi, form);
    
    // setTimeOut -> verilen süre sonunda(ex. 2 milisn sonra) git bu kodu calıstır
    // setInterval -> verilen sürede bir(ex. 2 milisnde bir) bu kodu calıstır.
    setTimeout(function() {
        const silinecekDiv = document.querySelector('.bilgi');
        if(silinecekDiv) {
            silinecekDiv.remove();
        }
    },2000);
}

function alanlariTemizle() {
    ad.value = '';
    soyad.value = '';
    no.value = '';
}



