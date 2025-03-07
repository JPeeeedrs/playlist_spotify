var slide = ["img/brandneweyes.jpg", 
    "img/fromzero.jpg", 
    "img/newlevelsnewdevils.jpg", 
    "img/paramore.jpg", 
    "img/takemebacktoeden.jpg", 
    "img/thisiswhy.jpg", 
    "img/toxicity.jpg", 
    "img/afterlaughter.jpg",  
    "img/meteora.jpg", 
    "img/minutestomidnight.jpg", 
    "img/rememberthatyouwilldie.jpg", 
    "img/riot!.jpg", 
    "img/sundowning.jpg", 
    "img/thatsthespirit.jpg"];

var captions = ["Brand New Eyes", 
    "From Zero", 
    "New Levels New Devils", 
    "Paramore", 
    "Take Me Back To Eden", 
    "This Is Why", 
    "Toxicity", 
    "After Laughter",  
    "Meteora", 
    "Minutes to Midnight", 
    "Remember That You Will Die", 
    "Riot!", 
    "Sundowning", 
    "That's the Spirit"];

var slideAtual = 0;

function carrossel() {
    document.querySelector(".slider img").src = slide[slideAtual];
    document.querySelector("#caption").textContent = captions[slideAtual]; // Atualiza a legenda
    slideAtual = (slideAtual + 1) % slide.length;
}

document.addEventListener("DOMContentLoaded", function() {
    setInterval(carrossel, 2000);
});
