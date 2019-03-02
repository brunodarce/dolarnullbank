
var $usd = document.getElementById('usd');
var $brl = document.getElementById('brl');
var $ptax = document.getElementById('ptax');
var $iof = document.getElementById('iof');
var $spread = document.getElementById('spread');

var defaultIof = 6.38;
var defaultSpread = 4;



// Consulta valor do dolar no Banco Central do Brasil
var d = new Date();
var nocache = '' + d.getFullYear() +
    zero(d.getMonth() + 1) +
    zero(d.getDate()) +
    zero(d.getHours());

var urlBCB = 'https://www.bcb.gov.br/api/conteudo/pt-br/PAINEL_INDICADORES/cambio?' + nocache;

fetch(urlBCB)
  .then(function(response){
    response.json().then(function(data){  
        initValues(data);              
    });
  })
  .catch(function(err){
    console.error('Failed retrieving information', err);
  });



// FUNÇÕES PRINCIPAIS

function usdToBrl() {
    $usd.value = numToStr($usd.value);
    // Valor da compra em dólar
    var usd = strToNum($usd.value);

    // Multiplica pelo valor do dólar ptax com spread
    var value = usd * getDollar();

    // Adiciona o IOF
    value += getIof() * value;

    // Arredondar valor
    value = round(value);

    $brl.value = numToStr(value);

}

function brlToUsd() {
    $brl.value = numToStr($brl.value);
    // Valor da compra em reais
    var brl = strToNum($brl.value);

    // Descobre o valor em dólar sem o IOF
    // USD + USD*IOF = BRL
    // USD*(1 + IOF) = BRL
    // USD = BRL/(1 + IOF)
    var value = brl / (1 + getIof());

    // Divide pelo valor de 1 dólar com spread
    value /= getDollar();

    // Arredondar valor
    value = round(value);   

    $usd.value = numToStr(value);

 
}

function initValues(data){
    $ptax.value = data.conteudo[1].valorVenda;
    $iof.value = defaultIof ;
    $spread.value = defaultSpread;
    $usd.disabled = false;
    $brl.disabled = false;
}


// FUNÇÕES AUXILIARES

function getIof() {
    return strToNum($iof.value) / 100;
}

function getSpread() {
    return strToNum($spread.value) / 100;
}

function getDollar() {
    return strToNum($ptax.value) * (1 + getSpread());
}

function strToNum(str) {
    return +str.replace(',', '.');
}

function numToStr(num) {
    return ('' + num).replace('.', ',');
}

function round(value) {
    // Arredondar valor final (https://stackoverflow.com/a/18358056)
    value = +(Math.round(value + "e+2")  + "e-2");

    // Garantir que vai usar duas casas decimais
    value = value.toFixed(2);

    return value;
}

function zero(n) {
    return n < 10 ? '0' + n : n;
}