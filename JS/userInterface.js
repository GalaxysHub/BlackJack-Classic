"use strict";

const btnCanvas = document.getElementById('btnCanvas');
const btnBGCanvas = document.getElementById('btnBGCanvas');

const btncHeight = cHeight/5;
btnCanvas.width = btnBGCanvas.width = cWidth;
btnCanvas.height = btnBGCanvas.height = btncHeight;
btnCanvas.style.top = btnBGCanvas.style.top = cHeight+'px';
btnCanvas.style.position = btnBGCanvas.style.position = 'absolute';
btnBGCanvas.style.zIndex = -1;

const BTNctx = btnCanvas.getContext('2d');
const BGBTNctx = btnBGCanvas.getContext('2d');



const btnsPics = ['RedButtonMain.png', 'BlueCircle.png','RedCircle.png','GreenCircle.png','YellowCircle.png','WhiteCircle.png'];

const chipBtnsPics = [
  'WhiteChip1Top.png',
  'RedChip5Top.png',
  'GreenChip25Top.png',
  'BlackChip100Top.png',
  'PurpleChip500Top.png'
]

const chipPics = [
  'WhiteChip1Side.png',
  'RedChip5Side.png',
  'GreenChip25Side.png',
  'BlackChip100Side.png',
  'PurpleChip500Side.png'
]

const chipValues = {
  PurpleChip500Side: 500,
  BlackChip100Side: 100,
  GreenChip25Side: 25,
  RedChip5Side: 5,
  WhiteChip1Side: 1
}

const btnsPicLoc = './Images/Misc/'
const chipsSideLoc = './Images/Misc/ChipsSideView/'
const buttonsImgMap = new Map();
const chipImgMap = new Map();
const chipBtnImgMap = new Map();

const promiseButtonsImgArr = asyncHelperFunctions.createPromImgArr(btnsPics, buttonsImgMap, btnsPicLoc);
const promiseChipSideViewImgArr = asyncHelperFunctions.createPromImgArr(chipPics, chipImgMap, chipsSideLoc);
const promisechipBtnImgArr = asyncHelperFunctions.createPromImgArr(chipBtnsPics, chipBtnImgMap, btnsPicLoc);


Promise.all(promiseButtonsImgArr.concat(promiseChipSideViewImgArr).concat(promisechipBtnImgArr)).then(()=>{
  // BGBTNctx.drawImage(buttonsImgMap.get('background2'),0,0,cWidth,btncHeight);//draws Background
  drawChipButtons();
  drawButtons();
  displayBalance();
});

const buttonsMap = new Map();
const optionButtonsMap = new Map();
const chipBtnMap = new Map();

function setCanvasButtons(){

}

(function setButtons(){
  const xPos = cWidth/2, yPos = btncHeight*.65,
    maxWid = cWidth/2, fontSize = btncHeight/2;

  const vertGap = btncHeight/20;

  const btnWid = 3*fontSize,
    btnHeight = fontSize,
    btnSize = Math.floor(btncHeight*0.6),
    btnXPos = Math.floor(xPos-btnWid/2),
    btnYPos = Math.floor((btncHeight-btnSize)/2),

    chipSize = btncHeight*0.5,
    chipsXPosStart = chipSize*0.5,
    chipsXDif = chipSize;

  optionButtonsMap.set("Play",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:vertGap, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Clear Bet",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight/2, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Double",{img:'BlueCircle',x:cWidth/2+btnSize, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Surrender",{img:'WhiteCircle',x:cWidth/2-2*btnSize, y:btnYPos, w:btnSize, h:btnSize});
  optionButtonsMap.set("Split",{img:'YellowCircle',x:cWidth/2+btnSize*2, y:btnYPos, w:btnSize, h:btnSize});
  buttonsMap.set("Hit",{img:'GreenCircle',x:cWidth/2, y:btnYPos, w:btnSize, h:btnSize});
  buttonsMap.set("Stand",{img:'RedCircle',x:cWidth/2-btnSize, y:btnYPos, w:btnSize, h:btnSize});

  const chipXPosArr = [];
  for(let i = 0; i<5; i++){
    let xPos = chipsXPosStart+chipsXDif*i-chipSize/2;
    chipXPosArr.push(xPos);
  }
  let yPosChip = btncHeight/2-chipSize/2;

  chipBtnMap.set('WhiteChip',{img:'WhiteChip1Top',x:chipXPosArr[0],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.WhiteChip1Side});
  chipBtnMap.set('RedChip',{img:'RedChip5Top',x:chipXPosArr[1],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.RedChip5Side});
  chipBtnMap.set('GreenChip',{img:'GreenChip25Top',x:chipXPosArr[2],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.GreenChip25Side});
  chipBtnMap.set('BlackChip',{img:'BlackChip100Top',x:chipXPosArr[3],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.BlackChip100Side});
  chipBtnMap.set('PurpleChip',{img:'PurpleChip500Top',x:chipXPosArr[4],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.PurpleChip500Side});
})()

function displayBetChips(){
  let fontSize = cHeight/20;
  anictx.font= fontSize+"px Arial";
  anictx.textAlign = 'center';
  anictx.textBaseline = 'hanging';

  for(let h = 0, numHands=pHandsArr.length; h<numHands; h++){
    let chipXLoc = pHandXLocs[h]-cardWidth,
    chipYLoc = pHandYLocs[0]-cardHeight,
    chipW = cardWidth*0.7,
    chipH = chipW*0.7,
    chipYDif =chipH/4;

    let numChips = calcMinChips();
    let chips = Object.keys(chipValues);
    let betXLoc = chipXLoc+chipW/2,
    betYLoc = chipYLoc+chipH,
    dif = 0;
    anictx.fillText(account.bet,betXLoc,betYLoc);
    for(let i = 0, len = chips.length; i<len; i++){
      for(let j = 0; j<numChips[i]; j++){
        anictx.drawImage(chipImgMap.get(chips[i]),chipXLoc,chipYLoc-dif*chipYDif,chipW,chipH);
        dif +=1;
      }
    }
  }
}

//calculates minimum number of each chip need to make a bet
function calcMinChips(){
  let values = Object.values(chipValues);
  let numChips = [];
  let bet = account.bet;
  let len = values.length
  for(let i = 0; i<len; i++){
    numChips[i] = Math.floor(bet/values[i]);
    bet = bet%values[i];
  }
  return numChips;
}

const pointer = {
  w: cWidth/25,
  h: cHeight/20,
}

function displayValue(){
  let fontSize = Math.floor(cHeight/20);
  anictx.font = fontSize+'px Arial';
  anictx.textAlign = 'center';
  anictx.textBaseline = 'middle';

  let pXPos = pHandXLocs[curHand],
    pYPos = Math.floor(cHeight*0.65),
    dYPos = Math.floor(cardHeight*1.6);
  anictx.clearRect(cWidth/2-fontSize, dYPos-fontSize, 2*fontSize, 1.5*fontSize);
  anictx.fillText(dHand.value,cWidth/2,cardHeight*1.6);
  anictx.clearRect(pXPos-fontSize,pYPos-fontSize,2*fontSize,1.5*fontSize);
  anictx.fillText(pHand.value,pXPos,pYPos);
}

function displayPointer(){
  disctx.clearRect(0,0,cWidth,cHeight);
  let p = pointer;
  p.x = pHandXLocs[curHand]-p.w/2;
  p.y = cHeight-cardHeight*1.8;
  disctx.drawImage(miscImgMap.get('DownArrowPointer'),p.x,p.y,p.w,p.h);
}

function displayBalance(){
  let fontSize = btncHeight/3;
  let xPos = Math.floor(cWidth*0.875)
  BGBTNctx.textAlign = 'center';
  BGBTNctx.font= fontSize+'px Arial';
  BGBTNctx.clearRect(cWidth*0.75,0,cWidth*0.25,btncHeight);
  BGBTNctx.fillText('Balance',xPos,btncHeight*0.4);
  BGBTNctx.fillText(account.balance,xPos,btncHeight*0.8);
}

function drawChipButtons(){
  chipBtnMap.forEach((b)=>{
    BGBTNctx.drawImage(chipBtnImgMap.get(b.img),b.x,b.y,b.w,b.h);
  })
}

function drawPlayBetBtns(){
  let p = optionButtonsMap.get('Play');
  let c = optionButtonsMap.get('Clear Bet');
  BTNctx.clearRect(cWidth/3,p.y,cWidth*0.6,btncHeight);
  BTNctx.drawImage(buttonsImgMap.get(p.img),p.x,p.y,p.w,p.h);
  BTNctx.drawImage(buttonsImgMap.get(c.img),c.x,c.y,c.w,c.h);

  if(account.bet<minBet){
    BTNctx.fillText('Bet at Least '+minBet,p.x+p.w/2,p.y+p.h/2,p.w*0.9);
    BTNctx.fillText('Clear Bet',c.x+c.w/2,c.y+c.h/2,c.w*0.9);
  }else{
    if(rebet){
      BTNctx.fillText('Rebet & Play',p.x+p.w/2,p.y+p.h/2,p.w*0.9);
      BTNctx.fillText('New Bet',c.x+c.w/2,c.y+c.h/2,c.w*0.9);
    }else{
      BTNctx.fillText('Play',p.x+p.w/2,p.y+p.h/2,p.w*0.9);
      BTNctx.fillText('Clear Bet',c.x+c.w/2,c.y+c.h/2,c.w*0.9);
    }
  }

}

function drawButtons(){
  BTNctx.clearRect(cWidth/3,0,cWidth*0.45,btncHeight);
  let fontSize = btncHeight/5;
  BTNctx.font = fontSize+'px Arial';
  BTNctx.textAlign = 'center';
  BTNctx.textBaseline = 'middle';

  let h = buttonsMap.get('Hit');
  let s = buttonsMap.get('Stand');
  BTNctx.drawImage(buttonsImgMap.get(h.img),h.x,h.y,h.w,h.h);
  BTNctx.fillText('Hit',h.x+h.w/2,h.y+h.h/2, s.w*0.9);
  BTNctx.drawImage(buttonsImgMap.get(s.img),s.x,s.y,s.w,s.h);
  BTNctx.fillText('Stand',s.x+s.w/2,s.y+s.h/2,s.w*0.9);

  if(pHand.cards.length==2){
    drawDoubleAndSurrenderBtn();
    if(pHand.cards[0][0]==pHand.cards[1][0]&&pHandsArr.length<splitUpTo){
      drawSplitBtn();
    }
  }
}

function drawDoubleAndSurrenderBtn(){
  let d = optionButtonsMap.get('Double');
  let s = optionButtonsMap.get('Surrender');
  BTNctx.drawImage(buttonsImgMap.get(d.img),d.x,d.y,d.w,d.h);
  BTNctx.fillText('Double',d.x+d.w/2,d.y+d.h/2,s.w*0.9);
  BTNctx.drawImage(buttonsImgMap.get(s.img),s.x,s.y,s.w,s.h);
  BTNctx.fillText('Surrender',s.x+s.w/2,s.y+s.h/2,s.w*0.9);
}

function drawSplitBtn(){
  let s = optionButtonsMap.get('Split')
  BTNctx.drawImage(buttonsImgMap.get(s.img),s.x,s.y,s.w,s.h);
  BTNctx.fillText('Split',s.x+s.w/2,s.y+s.h/2,s.w*0.9);
}

function getMousePos(cvn, evt){
  var rect = cvn.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.w && pos.y < rect.y+rect.h && pos.y > rect.y
}

btnCanvas.addEventListener('click', function(evt){
  let mousePos = getMousePos(btnCanvas,evt);

  if(playingGame){
    if(isInside(mousePos,buttonsMap.get('Hit'))){
      hit(pHand);
      drawButtons();
      console.log(pHand.value);
      if(pHand.value>20){
        drawPlayBetBtns();
        dealerAction();
      }
    }else if(isInside(mousePos,buttonsMap.get('Stand'))){
      stand();
    }else if(pHand.cards.length==2){
      if(isInside(mousePos,optionButtonsMap.get('Double'))){doubleDown();}
      if(isInside(mousePos,optionButtonsMap.get('Surrender'))){surrender();}
      if(pHand.cards[0][0]==pHand.cards[1][0]&&isInside(mousePos,optionButtonsMap.get('Split'))){
        split();
        displayBetChips();
      }
    }
    if(pHandsArr.length>(curHand+1)){
      drawButtons();
    }
    displayCards();
    displayValue();
    displayPointer();
  }else{
    if(isInside(mousePos,optionButtonsMap.get('Play'))&&account.bet>=minBet){
      console.log('PlayGame');
      playingGame = true;
      newGame();
      displayBalance();
      if(pHand.value!=21)drawButtons();
    }
    if(rebet==false){
      if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
        account.bet=0;
        console.log('bet cleared');
      }
      //Changes bet based on chips selected
      chipBtnMap.forEach(chip=>{
        if(isInside(mousePos,chip)){
          anictx.clearRect(0,0,cWidth/2,cHeight);
          account.bet+=chip.v;
        }
      })
    }else if(rebet==true){
      if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
        rebet=false;
        account.bet=0;
        console.log('bet cleared');
        drawPlayBetBtns();
      }
    }
    displayBetChips();
  }

},false);
