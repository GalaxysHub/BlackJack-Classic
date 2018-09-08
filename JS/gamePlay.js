"use strict";

let pHandsArr = [];
let curHand;
let hasSplit = false;

let lastBet;
let rebet = true;
let playingGame = true;

function Hand(cards=[], val=0, nAces=0){
  this.cards = cards;
  this.value = val;
  this.numAces = nAces;
  this.bet = account.bet;
}

let pHand, dHand;

function newGame(){
  account.balance-=account.bet;
  rebet = true;
  pHandsArr = [];
  pHand = new Hand();
  dHand = new Hand();
  // lastBet = account.bet;
  ctx.clearRect(0,0,cWidth,cHeight);
  anictx.clearRect(0,0,cWidth,cHeight);
  disctx.clearRect(0,0,cWidth,cHeight);
  curHand = 0;
  hasSplit = false;
  for(let i = 0; i<2; i++){
    hit(pHand);
    hit(dHand);
  }
  pHandsArr[0]=pHand;
  checkBlackJack(pHand);
  displayCards();
  displayValue();
}

function checkBlackJack(hand){
  if(hand.value===21&&hand.cards.length==2){
    let fontSize = cHeight/20;
    console.log('BlackJack');
    anictx.textAlign = 'center';
    anictx.font = fontSize+"px Arial";
    anictx.fillText('BlackJack',pHandXLocs[curHand],cHeight/2);
    //Check for push
    account.balance+=account.bet*2.5
    playingGame = false;
    rebet = true;
  }
}

function displayCards(){
  let xDif = Math.floor(cardWidth/7),
    yDif = Math.floor(cardHeight/7);

  for(let i = 0; i<pHandsArr.length; i++){
    let pCards = pHandsArr[i].cards;
    let xLocStartP = pHandXLocs[i]-cardWidth/2,
      yLocStartP = cHeight*0.95-cardHeight;

    function drawPHand(){
      for(let j = 0; j<pCards.length; j++){
        let xLoc = xLocStartP + xDif*j;
        let yLoc = yLocStartP - yDif*j;
        ctx.drawImage(cardImgMap.get(pCards[j]), xLoc, yLoc,cardWidth, cardHeight);
      }
    }
    drawPHand();
  }

  function drawDHand(){
    let xLocStart = cWidth/2-cardWidth/2;
    let yLocStart = cHeight*0.05

    for(let j = 0; j<dHand.cards.length; j++){
      let xLoc = xLocStart - xDif*j;
      let yLoc = yLocStart + yDif*j;
      ctx.drawImage(cardImgMap.get(dHand.cards[j]), xLoc, yLoc,cardWidth, cardHeight);
    }
  }
  drawDHand();
}

function split(){
  let newBalance = account.balance-account.bet;
  if(pHandsArr.length<splitUpTo&&newBalance>=0){
    hasSplit = true;
    account.balance = newBalance;
    let splitHand = new Hand(pHandsArr[curHand].cards.splice(1,1));//splits hand
    hit(pHandsArr[curHand])//draws on first hand
    hit(splitHand);//draws on second hand
    pHandsArr.push(splitHand);
    displayCards();
    displayBalance();
  }else{console.log("can't split")}
}

function hit(hand){
  hand.cards.push(draw());
  calcHandValue(hand);
}

function doubleDown(){
  console.log('double down');
  account.balance-=account.bet;
  pHand.bet = 2*account.bet;
  displayBalance();
  hit(pHand);
  stand();
}

function surrender(){
  console.log('surrender');
  account.balance-=account.bet/2;
  stand();
}

function insurance(){

}

function stand(){
  pHandsArr[curHand] = pHand;
  let nextHand = curHand+1;
  if(hasSplit&&(nextHand)<pHandsArr.length){
    curHand = nextHand;
    pHand = pHandsArr[curHand];
    checkBlackJack(pHand);
    drawButtons();
  }else{dealerAction()}
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
  if(sum>21){bust(hand);}
}

function bust(hand){
  console.log('bust');
  let fontSize = cHeight/12;
  anictx.font = fontSize+"px Arial";
  anictx.textAlign = 'center';
  anictx.textBaseline = 'middle';
  if(hand==pHand){
    anictx.fillText('Bust',pHandXLocs[curHand],cHeight-cardHeight);
  }
  stand();
}

function dealerAction(){
  //dealer hits on anything less than 17 and soft 17
  while(dHand.value<17||(dHand.value==17&&dHand.numAces>0)){
    hit(dHand);
  }
  console.log('dealer action');
  findWinner();
  playingGame=false;
  drawPlayBetBtns();
}

function findWinner(){
  pHandsArr.map(hand=>{
    let pValue = hand.value,
      dValue = dHand.value;
    if(pValue>21){console.log('Player busts')}
    else if(pValue>dValue&&pValue<22){console.log('player wins'); account.balance+=2*hand.bet}
    else if(pValue<22&&dValue>21){
      console.log('Dealer busts. Player wins'); account.balance+=2*hand.bet
    }
    else if(pValue===dValue){console.log('push'); account.balance+=hand.bet}
    else{console.log('dealer wins');}
  })
  drawPlayBetBtns();
}
