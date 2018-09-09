"use strict";


let cWidth = window.innerWidth*0.8;
let cHeight = cWidth*2/3;

const BGCanvas = document.getElementById('BGCanvas');
const mainCanvas = document.getElementById('mainCanvas');
const aniCanvas = document.getElementById('aniCanvas');
const displayCanvas = document.getElementById('displayCanvas');

displayCanvas.style.position = mainCanvas.style.position = BGCanvas.style.position = aniCanvas.style.position = 'absolute';
displayCanvas.width = mainCanvas.width = BGCanvas.width = aniCanvas.width = cWidth;
displayCanvas.height = mainCanvas.height = BGCanvas.height = aniCanvas.height = cHeight;
BGCanvas.style.zIndex = -1;
aniCanvas.style.zIndex = 5;
displayCanvas.style.zIndex = 10;

const anictx = aniCanvas.getContext('2d'),
  ctx = mainCanvas.getContext('2d'),
  BGctx = BGCanvas.getContext('2d'),
  disctx = displayCanvas.getContext('2d');

const account = {
  balance: 10000,
  lastBet: 0,
  bet: 100
}
const minBet = 100,
  maxBet = 1000;

const splitUpTo = 5;
const pHandXDif = Math.floor(cWidth/(splitUpTo+1)),
  pHandYDif = Math.floor(cHeight/20);

const cardWidth = Math.floor(cWidth/10),
  cardHeight = Math.floor(cardWidth*1.5);


let shoe = [];

const pHandXLocs = [cWidth/2],
  pHandYLocs = [cHeight*0.8] //used for splitting

for(let i = 1; i<splitUpTo; i++){
  if(i%2==1){pHandXLocs.push(pHandXLocs[i-1]+i*pHandXDif)}
  if(i%2==0){pHandXLocs.push(pHandXLocs[i-1]-i*pHandXDif)}
}

// const setUp = (function(){
  const cardPicLoc = "./Images/Cards/";
  const picLoc = "./Images/Misc/";
  const cardImgMap = new Map();
  const miscImgMap = new Map();
  const pics = ['GreenFelt.jpg','DownArrowPointer.png'];
  const btnPics = [];
  const cardSuits = ['C','S','D','H'];
  const faceCards = ['A'];
  const numDecks = 6;

  //adds all of the cards for a single deck of cards
  const deckCards = [];
  cardSuits.forEach((suit)=>{
    for(let i = 9; i<=13; i++){
      deckCards.push(i+suit);
    }
    faceCards.forEach(c=>{
      deckCards.push(c+suit);
    })
  });

  const deckPics = [];//names of card pics
  deckCards.forEach((card)=>{deckPics.push(card+'.png');})

  const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc);
  const promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

  Promise.all(promiseCardImgArr.concat(promiseMiscPicArr)).then(()=>{
    drawBG();
    // drawRandomCards();
    newGame();
  });

  function drawBG(){
    BGctx.drawImage(miscImgMap.get('GreenFelt'),0,0,cWidth,cHeight);
  }

  function createShoe(){
    for(let i = 0; i<numDecks; i++){
      shoe.push(...deckCards);
    }
  }
  createShoe();

  function draw(){
    let r = Math.floor(Math.random()*shoe.length)
    return shoe.splice(r,1)[0];
  }

  function drawRandomCards(){
    for(let i = 0; i<pHandXLocs.length; i++){
      ctx.fillStyle = 'white';
      let card = draw();
      // ctx.fillRect(pHandXLocs[i]-cardWidth/2,cHeight*0.75,cardWidth,cardHeight);
      ctx.drawImage(cardImgMap.get(card),pHandXLocs[i]-cardWidth/2,cHeight*0.75,cardWidth,cardHeight)
    }
  }

  // return{
  //   cardImgMap:cardImgMap,
  //
  // }
// })()
