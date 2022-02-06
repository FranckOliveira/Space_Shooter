const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/alien.png', 'img/alien2.png', 'img/alien3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const canvas = document.querySelector('canvas');
//const contexto = canvas.getContext("2d");

const som_HIT = new Audio();
som_HIT.src = './sons/explosion.mp3';

var placar = 1;
var infopontos = document.getElementById('SCORE');

//Pontuação
function pontuou (){
    placar ++ ;
    infopontos.innerHTML = 'Pontos: \n'+`${placar}`;
}
   

let alienInterval;
//jogabilidade
function flyShip(event) {
    if(event.key === 'w') {
        event.preventDefault(); //prevenir ação do navegador
        moveUp();
    } else if(event.key === "s") {
        event.preventDefault(); //prevenir ação do navegador
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault(); //prevenir ação do navegador
        FireLaser();
    }
}

//func subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

//func descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "500px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

//funcs fire
function FireLaser() {
    let laser = creatLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function creatLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = './img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition -10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //verificando colisao entre laser e inimigo
            if(checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                som_HIT.play();
                laser.remove();
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                pontuou();
            }
        })
        if(xPosition === 500) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 6}px`;
        }
    }, 15);
}

//criar inimigos
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //aleatorios
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '490px';
    newAlien.style.top = `${Math.floor(Math.random() * 500) + 20}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//movimentar inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 10){
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            } 
            } else {
                alien.style.left = `${xPosition - 3}px`;
            }
    }, 30);
}

//colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 50;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 50;
    if(laserLeft != 500 && laserLeft + 50 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//start game
startButton.addEventListener('click', (event) => {
    playgame();
})

function playgame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    
    alienInterval = setInterval(() => {
        createAliens();
    }, 1500);
}

//FIM DE JOGO
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('FIM DE JOGO! RETORNE AO INÍCIO');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}

