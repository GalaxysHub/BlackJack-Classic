"use strict";

let pHandsArr = [];
let curHand = 0;
let hasSplit = false;
let rebet = false;
let playingGame = false;
let insuranceOpt = false;
let checkingCard = false;

function Hand(cards=[], val=0, nAces=0){
  this.cards = cards;
  this.value = val;
  this.numAces = nAces;
  this.bet = account.bet;
}

let pHand, dHand;
function newGame(){
  let wait = 20;

  if(shoe.length<cutCard){createShoe();}
  account.balance-=account.bet;
  rebet = true;
  pHandsArr = [];
  pHand = new Hand();
  dHand = new Hand();

  curHand = 0;
  hasSplit = false;
  pHandsArr[0] = pHand;

  createpHandsXLocs();// required due to splitting

  hit(dHand,0,null,false);
  hit(pHand,wait);
  hit(dHand,2*wait);
  hit(pHand,3*wait,curHand,true,()=>{
    displayPValue();
    displayBetChips();

    let exposedCardVal = dHand.cards[1][0];
    if(exposedCardVal=='A'){
      insuranceOpt = true;
      checkingCard = true;
      glassBtnCanvas.style.zIndex = -1;
      drawButtons();
    }else if(exposedCardVal=='1'){
      checkDealerBlackJack();
    }else{
      playingGame = true;
      checkBlackJack(pHand)
      glassBtnCanvas.style.zIndex = -1;
    }
  });

}

function checkBlackJack(hand,playingHand=true){//players hand only
  if(hand.value===21&&hand.cards.length==2){
    hand.blackJack = true;
    console.log('BlackJack');
    let numHands = pHandsArr.length
    if(numHands==1){
      playingGame=false;
      strokeAndFillText(gctx,'BlackJack!',cWidth/2,cHeight-cardH*0.7);
    }else{
      drawPHandsArr();//need to write BlackJack to hand. Can't simplify well
    }
    if(playingHand){stand();}
  }
  drawButtons();
}

function checkDealerBlackJack(cb=()=>{}){
  insuranceOpt = false;
  checkingCard = true;
  drawButtons();
  let wait = 20;
  let reveal = false;
  if(dHand.value==21){reveal = true;}

  //Animation
  revealDealerCard(reveal,()=>{
    strokeAndFillText(gctx,'BlackJack!',cWidth/2,cHeight*0.05+cardH/2,cWidth);
    playingGame = false;
    checkingCard = false;
    if(pHand.value==21){
      strokeAndFillText(gctx,'BlackJack!',cWidth/2,cHeight-cardH*0.7);
    }
    findWinner();
    drawButtons();
    cb();
  },wait);
}

function createpHandsXLocs(){
  let numHands = pHandsArr.length;
  let xDis = cWidth/(numHands+1);
  pHandXLocs.splice(0,pHandXLocs.length);
  for(let i = 1, j=numHands+1; i<j; i++){
    pHandXLocs.push(Math.floor(xDis*i));
  }
}

function calcHandValue(hand){
  hand.numAces = 0;
  let sum = 0;
  hand.cards.forEach(card=>{
    let n = card.slice(0,1);
    let v;
    if(n=='A'){ hand.numAces+=1; v = 11;
    }else if(n==='J'||n==='Q'||n==='K'||n==='1'){v = 10;
    }else{v = parseInt(n);}
    sum+=v;
  })
  //reduces handValue if over 21 with aces
  while(sum>21&&hand.numAces>0){
    sum-=10;
    hand.numAces-=1;
  }
  hand.value = sum;
  if(sum>21){
    glassBtnCanvas.style.zIndex = 99;
    bust(hand);
  }
  else if(hand.double){stand()}
}

function dealerAction(){
  playingGame = false;
  glassBtnCanvas.style.zIndex = 99;
  console.log('dealer action');
  //animate card flip
  revealDealerCard(true,()=>{
    displayDValue();
    dealerHit();
  })
  //dealer hits on less than 17 and soft 17
  function dealerHit(){
    if(dHand.value<17||(dHand.value==17&&dHand.numAces>0)){
      hit(dHand,0,0,true,()=>{
        displayDValue();
        dealerHit();
      },disctx);
    }else{
      findWinner();
    }
  }
}

function findWinner(){
  for(let i = 0, n = pHandsArr.length; i<n; i++){
    let cnv = document.createElement('canvas');
    cnv.id= 'canvas'+i;
    document.body.appendChild(cnv);
    setDefCanvasProps(cnv.id,i);

    let chipctx = cnv.getContext('2d');

    let hand = pHandsArr[i];
    let pValue = hand.value,
    dValue = dHand.value;

    if(hand.surrendered){
      console.log('surrendered');
      dealerWins(i,chipctx);
    }else if(hand.blackJack){
      playerBJ(i,chipctx);
    }else if(pValue>21){
      console.log('Player busts')
      dealerWins(i,chipctx);
    }else if(pValue>dValue&&pValue<22){
      playerWins(i,chipctx);
    }else if(pValue<22&&dValue>21){
      console.log('Dealer busts.');
      playerWins(i,chipctx);
    }else if(pValue===dValue){
      push(i,chipctx);
    }else{
      dealerWins(i,chipctx);
    }
    //Need to remove canvases when done;
    if(i==(n-1)){
      aniLib.wait(globalRate*3,()=>{
        removeCanvases(n)
        displayBalance();
        discard();
      })
    }
  }
  drawPlayBetBtns();
}

function discard(){
  gctx.clearRect(0,0,cWidth,cHeight);
  disctx.clearRect(0,0,cWidth,cHeight);//clears points and pointer
  ctx.clearRect(0,0,cWidth,cHeight);//clears all drawn cards
  let rate = 60;
  let wait = Math.floor(rate/6);
  let dCards = dHand.cards;
  let lenDHand = dCards.length;

  let xFin = -2*cardW, yFin = -2*cardH;

  for(let i = 0; i<lenDHand; i++){
    let dCard = cardImgMap.get(dCards[i]);
    let xLoc = dHandxLocStart-i*xCardDif;
    let yLoc = dHandyLocStart+i*yCardDif;

    let cnv = document.createElement('canvas');
    cnv.id = 'canvas'+i;
    document.body.appendChild(cnv)
    setDefCanvasProps(cnv.id,i);
    let dctx = cnv.getContext('2d');

    let d = lenDHand-i
    dctx.drawImage(dCard,xLoc,yLoc,cardW,cardH); //redraws cards on new canvas
    aniLib.slide(dCard,xLoc,yLoc,xFin,yFin,cardW,cardH,rate,d*wait,dctx,()=>{});
  }

  let n = lenDHand;
  for(let i = 0, numHands = pHandsArr.length; i<numHands; i++){
    let pCards = pHandsArr[i].cards;

    for(let j = 0, numCards = pCards.length; j<numCards; j++){
        let cnv = document.createElement('canvas');
        cnv.id = 'canvas'+n;
        document.body.appendChild(cnv)
        n++;
        setDefCanvasProps(cnv.id,n);
        let dctx = cnv.getContext('2d');

        let pCard = cardImgMap.get(pCards[j]);
        let xLoc = pHandXLocs[i]-cardW/2+j*xCardDif;
        let yLoc = pHandYLocs-j*yCardDif;

        let d = numCards-j+i;

        dctx.drawImage(pCard,xLoc,yLoc,cardW,cardH);
        aniLib.slide(pCard,xLoc,yLoc,xFin,yFin,cardW,cardH,rate,d*wait,dctx,()=>{
          if(i==numHands-1&&j==numCards-1){
            removeCanvases(n);
            glassBtnCanvas.style.zIndex = -1;
          }
        });
    }
  }
}
