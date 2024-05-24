const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const data = [];
const bist100Data = [];
const market = [];
const news = [];

app.get('/', (req,res) => {
    res.send('Welcome');
});

// BIST100 Verileri
app.get('/bist100', (req,res) => {
    bist100Data.splice(0,bist100Data.length);
    axios.get('https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/').then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a', html).each(function () {
            if($(this).attr('href').includes('/borsa/hisse-fiyatlari/')){
                const hisse = $(this).text();
                if(!hisse.includes('Hisse') && !hisse.includes('HİSSE')){
                    const hisseSembolu = hisse;
                    const sonFiyat = $(`li[id=h_td_alis_id_${hisse}]`, html).text(); 
                    const satisFiyat = $(`li[id=h_td_satis_id_${hisse}]`, html).text(); 
                    const fiyat = $(`li[id=h_td_fiyat_id_${hisse}]`, html).text(); 
                    const dusukFiyat = $(`li[id=h_td_dusuk_id_${hisse}]`, html).text(); 
                    const ortalama = $(`li[id=h_td_aort_id_${hisse}]`, html).text(); 
                    const yuzde = $(`li[id=h_td_yuzde_id_${hisse}]`, html).text(); 
                    const dunKapanis = $(`li[id=h_td_dunkapanis_id_${hisse}]`, html).text(); 
                    const fark = $(`li[id=h_td_farktl_id_${hisse}]`, html).text(); 
                    const taban = $(`li[id=h_td_taban_id_${hisse}]`, html).text(); 
                    const tavan = $(`li[id=h_td_tavan_id_${hisse}]`, html).text(); 
                    const hacimLot = $(`li[id=h_td_hacimlot_id_${hisse}]`, html).text(); 
                    const hacim = $(`li[id=h_td_hacimtl_id_${hisse}]`, html).text(); 
                    const saat = $(`li[id=h_td_saat_id_${hisse}]`, html).text(); 
                    bist100Data.push({
                        hisseSembolu,
                        sonFiyat,
                        satisFiyat,
                        fiyat,
                        dusukFiyat,
                        ortalama,
                        yuzde,
                        dunKapanis,
                        fark,
                        taban,
                        tavan,
                        hacimLot,
                        hacim,
                        saat
                    });
                
                }
            }
        });


        res.json(bist100Data);
    }).catch((err) => console.log(err));
});

// Hisse Arama
app.get('/bist100/:share', (req,res) => {
    data.splice(0,data.length);
    const { share } = req.params;
    axios.get('https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/').then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const hisse = share;
    const sonFiyat = $(`li[id=h_td_alis_id_${share}]`, html).text(); 
    const satisFiyat = $(`li[id=h_td_satis_id_${share}]`, html).text(); 
    const fiyat = $(`li[id=h_td_fiyat_id_${share}]`, html).text(); 
    const dusukFiyat = $(`li[id=h_td_dusuk_id_${share}]`, html).text(); 
    const ortalama = $(`li[id=h_td_aort_id_${share}]`, html).text(); 
    const yuzde = $(`li[id=h_td_yuzde_id_${share}]`, html).text(); 
    const dunKapanis = $(`li[id=h_td_dunkapanis_id_${share}]`, html).text(); 
    const fark = $(`li[id=h_td_farktl_id_${share}]`, html).text(); 
    const taban = $(`li[id=h_td_taban_id_${share}]`, html).text(); 
    const tavan = $(`li[id=h_td_tavan_id_${share}]`, html).text(); 
    const hacimLot = $(`li[id=h_td_hacimlot_id_${share}]`, html).text(); 
    const hacim = $(`li[id=h_td_hacimtl_id_${share}]`, html).text(); 
    const saat = $(`li[id=h_td_saat_id_${share}]`, html).text(); 

    data.push({
        hisse,
        sonFiyat,
        satisFiyat,
        fiyat,
        dusukFiyat,
        ortalama,
        yuzde,
        dunKapanis,
        fark,
        taban,
        tavan,
        hacimLot,
        hacim,
        saat
    });


    res.json(data);
}).catch((err) => console.log(err));
});

// Piyasalar (Bist-Dolar-Euro-Altın)
app.get('/market', (req,res) => {
    market.splice(0,market.length);
    axios.get('https://bigpara.hurriyet.com.tr/borsa/hisse-senetleri/').then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const marketArray = $('div[class=chartItem]', html).text().replace(/[\n\r]\s+/g,' ').trim(); 
    // Bist
    const bist = marketArray.split(' ')[0];
    const degisimBist = marketArray.split(' ')[2];
    const hacimBist = marketArray.split(' ')[5];
    const dusukBist = marketArray.split(' ')[13];
    const acilisBist = marketArray.split(' ')[20];
    const sonVeriSaatiBist = marketArray.split(' ')[11];
    const yuksekBist = marketArray.split(' ')[17];
    const tarihBist = marketArray.split(' ')[15];
    
    // Dolar
    const dolar = marketArray.split(' ')[21];
    const degisimdolar = marketArray.split(' ')[23];
    const dusukdolar = marketArray.split(' ')[25];
    const tarihdolar = marketArray.split(' ')[27];
    const yuksekdolar = marketArray.split(' ')[29];
    const acilisdolar = marketArray.split(' ')[32];

    // Euro
    const euro = marketArray.split(' ')[33];
    const degisimeuro = marketArray.split(' ')[35];
    const dusukeuro = marketArray.split(' ')[37];
    const tariheuro = marketArray.split(' ')[39];
    const yuksekeuro = marketArray.split(' ')[41];
    const aciliseuro = marketArray.split(' ')[44]; 

    // Altın
    const altin = marketArray.split(' ')[45];
    const degisimaltin = marketArray.split(' ')[47];
    const dusukaltin = marketArray.split(' ')[49];
    const tarihaltin = marketArray.split(' ')[51];
    const yuksekaltin = marketArray.split(' ')[53];
    const acilisaltin = marketArray.split(' ')[56]; 

    market.push({
        bist,
        degisimBist,
        hacimBist,
        yuksekBist,
        acilisBist, 
        dusukBist , 
        tarihBist,
        sonVeriSaatiBist, 
        dolar,
        degisimdolar,
        dusukdolar,
        tarihdolar,
        yuksekdolar,
        acilisdolar,
        euro,
        degisimeuro,
        dusukeuro,
        tariheuro,
        yuksekeuro,
        aciliseuro,
        altin,
        degisimaltin,
        dusukaltin,
        tarihaltin,
        yuksekaltin,
        acilisaltin
    });

    res.json(market);
}).catch((err) => console.log(err));
});

// Ekonomi Haberleri 
app.get('/news', (req,res) => {
    news.splice(0,news.length);
    axios.get('https://www.sondakika.com/ekonomi/').then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('li[class=nws]', html).each(function () {
            const totalArray = $(this).text().trim().split("   ");
            const saat = totalArray[0];
            const baslik = totalArray[2];
            const aciklama = totalArray[3];

            // const imgArray = $('img', html).attr('alt');
            // console.log(imgArray);

            news.push({
                saat,
                baslik,
                aciklama,
            });
        
            });
        res.json(news);
    }).catch((err) => console.log(err));
});


app.listen(PORT, () => {
    console.log('Server running...');
});