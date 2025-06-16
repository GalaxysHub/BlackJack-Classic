"use strict";

const cWidth = Math.floor(window.innerWidth * 0.98);
const cHeight = Math.floor(cWidth * 0.55);

let xMargin = 0;
let yTop = 0;
if (window.innerWidth > cWidth) {
  xMargin = Math.floor((window.innerWidth - cWidth) / 2);
}

const BGCanvas = document.getElementById('BGCanvas');
const mainCanvas = document.getElementById('mainCanvas');
const aniCanvas = document.getElementById('aniCanvas');
const displayCanvas = document.getElementById('displayCanvas');
const slideCanvas = document.getElementById('slideCanvas');
const glassCanvas = document.getElementById('glassCanvas');
const betChipsCanvas = document.getElementById('betChipsCanvas');

const canvasArr = [BGCanvas, mainCanvas, aniCanvas, displayCanvas, slideCanvas, glassCanvas, betChipsCanvas];
canvasArr.forEach(cnv => {
  cnv.style.position = 'absolute';
  cnv.style.marginTop = yTop + 'px';
  cnv.style.left = xMargin + 'px';
  cnv.width = cWidth;
  cnv.height = cHeight;
});

BGCanvas.style.zIndex = -1;
aniCanvas.style.zIndex = 25;
displayCanvas.style.zIndex = 10;
glassCanvas.style.zIndex = 99;
betChipsCanvas.style.zIndex = 15;
slideCanvas.style.zIndex = 10;

const anictx = aniCanvas.getContext('2d');
const ctx = mainCanvas.getContext('2d');
const BGctx = BGCanvas.getContext('2d');
const disctx = displayCanvas.getContext('2d');
const sctx = slideCanvas.getContext('2d');
const bctx = betChipsCanvas.getContext('2d');
const gctx = glassCanvas.getContext('2d');

const ctxArr = [ctx, BGctx, anictx, disctx, sctx, bctx, gctx];

ctxArr.forEach(ctx => {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
});

const stdFontSize = Math.floor(cHeight / 20);

function setCtxProps() {
  const gFontSize = Math.floor(cHeight / 6);
  gctx.font = gFontSize + 'px TheBlacklist';
  gctx.lineWidth = Math.floor(cWidth / 120);
  gctx.strokeStyle = 'black';
  gctx.fillStyle = 'rgb(180,15,15)';
  gctx.shadowOffsetX = gFontSize / 15;
  gctx.shadowOffsetY = gFontSize / 15;
  gctx.shadowColor = "rgba(0,0,0,0.5)";
  gctx.shadowBlur = 4;

  bctx.strokeStyle = 'black';
  bctx.fillStyle = 'white';
  bctx.font = stdFontSize + 'px Chela';
  anictx.font = bctx.font;
  disctx.fillStyle = 'white';
  disctx.font = stdFontSize + 'px Chela';
}

const account = {
  balance: 10000,
  bet: 0
};

const minBet = 100;
const maxBet = 1000;
const splitUpTo = 5;
const cutCard = 23;

const pHandXDif = Math.floor(cWidth / (splitUpTo + 1));
const pHandYDif = Math.floor(cHeight / 20);

const cardW = Math.floor(cWidth / 10);
const cardH = Math.floor(cardW * 1.5);

const pHandXLocs = []; // used for splitting
const pHandYLocs = cHeight * 0.95 - cardH;

const cardPicLoc = "./Images/Cards/";
const picLoc = "./Images/Misc/";
const cardImgMap = new Map();
const miscImgMap = new Map();
const pics = ['GreenFelt.jpg', 'DownArrowPointer.png', 'WhiteRabbitBack.png'];
const btnPics = [];
const cardSuits = ['C', 'S', 'D', 'H'];
const numDecks = 6;

// adds all of the cards for a single deck of cards
const deckCards = [];
cardSuits.forEach((suit) => {
  for (let i = 2; i <= 13; i++) {
    deckCards.push(i + suit);
  }
  deckCards.push('A' + suit);
});

const deckPics = []; // names of card pics
deckCards.forEach((card) => {
  deckPics.push(card + '.png');
});

// Modern async initialization
async function initializeGame() {
  try {
    // Load all images concurrently
    await Promise.all([
      asyncHelperFunctions.loadImages(deckPics, cardImgMap, cardPicLoc),
      asyncHelperFunctions.loadImages(pics, miscImgMap, picLoc)
    ]);
    
    // Load fonts
    await asyncHelperFunctions.loadFonts(['12px TheBlacklist', '12px Chela']);
    
    // Initialize game components
    setCtxProps();
    drawBG();
    pHand = new Hand();
    pHandsArr[0] = pHand;
    pHandXLocs[0] = cWidth / 2;
    
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game initialization
initializeGame();

function drawBG() {
  BGctx.drawImage(miscImgMap.get('GreenFelt'), 0, 0, cWidth, cHeight);
  BGctx.strokeRect(0, 0, cWidth, cHeight);
}

let shoe;
function createShoe() {
  shoe = [];
  for (let i = 0; i < numDecks; i++) {
    shoe.push(...deckCards);
  }
}
createShoe();

function draw() {
  const r = Math.floor(Math.random() * shoe.length);
  return shoe.splice(r, 1)[0];
}

function setDefCanvasProps(cnvID, num) {
  const cnv = document.getElementById(cnvID);
  document.body.appendChild(cnv);
  cnv.style.zIndex = 10 + num;
  cnv.style.position = 'absolute';
  cnv.style.marginTop = yTop + 'px';
  cnv.style.left = xMargin + 'px';
  cnv.width = cWidth;
  cnv.height = cHeight;
}

function removeCanvases(num) {
  for (let i = 0; i < num; i++) {
    const id = 'canvas' + i;
    const canvas = document.getElementById(id);
    if (canvas) {
      canvas.remove();
    }
  }
}
