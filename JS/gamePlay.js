"use strict";

let pHandsArr = [];
let curHand;
let lastBet;
let hasSplit = false;
let surrendered = false;
let rebet = true;
// let playersTurn = false;
let playingGame = true;
let insuranceOpt = false;
let insured = false;
let checkingCard = false;

function Hand(cards=[], val=0, nAces=0){
  this.cards = cards;
  this.value = val;
  this.numAces = nAces;
  this.bet = account.bet;
}

let pHand, dHand;
function newGame(){
  // playersTurn = true
  if(shoe.length<cutCard){createShoe();}
  surrendered = false;
  account.balance-=account.bet;
  rebet = true;
  pHandsArr = [];
  pHand = new Hand();
  dHand = new Hand();
  // lastBet = account.bet;
  ctx.clearRect(0,0,cWidth,cHeight);
  anictx.clearRect(0,0,cWidth,cHeight);
  bctx.clearRect(0,0,cWidth,cHeight);//clears chip stacks. animations should render obselete
  disctx.clearRect(0,0,cWidth,cHeight);
  gctx.clearRect(0,0,cWidth,cHeight);

  curHand = 0;
  hasSplit = false;
  for(let i = 0; i<2; i++){
    //Add animations here
    hit(pHand);
    hit(dHand);
  }
  playingGame = true;
  pHandsArr[0]=pHand;


  createpHandsXLocs();// simplify
  drawDHandStart();
  drawPHandsArr();
  displayPValue();

  let exposedCardVal = dHand.cards[1][0];
  if(exposedCardVal=='A'){
    insuranceOpt = true;
    checkingCard = true;
    drawButtons();
  }else if(exposedCardVal=='1'){
    checkDealerBlackJack();
  }else{
    playingGame = true;
  }
  checkBlackJack(pHand)
}

function checkBlackJack(hand){
  if(hand.value===21&&hand.cards.length==2){
    hand.blackJack = true;
    console.log('BlackJack');
    let numHands = pHandsArr.length
    if(numHands==1){
      playingGame=false;
      strokeAndFillText(gctx,'BlackJack',cWidth/2,cHeight-cardH*0.7);
    }else{
      drawPHandsArr();//need to write BlackJack to hand. Can't simplify well
    }
    if(checkingCard===false){
      stand();
    }
  }
  drawButtons();
}

function checkDealerBlackJack(cb=()=>{}){
  checkingCard = true;
  drawButtons();
  let xLocStart = cWidth/2-cardW/2,
    yLocStart = cHeight*0.05,
    xFin = xLocStart+cardW/2,
    xFin2 = xLocStart+cardW;
  //Animation
  let cardBack = miscImgMap.get('WhiteRabbitBack');
  let holeCard = cardImgMap.get(dHand.cards[0])
  let exposedCard = cardImgMap.get(dHand.cards[1]);

  anictx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of animation edge cases
  animations.slide(cardBack,xLocStart,yLocStart,xFin,yLocStart,cardW,cardH,20,0,ctx,()=>{
    if(dHand.value==21){
      let n = 15
      let inc = (2*cardW)/n;
      animations.slide(cardBack,xFin,yLocStart,xFin2,yLocStart,cardW,cardH,10,20,ctx,()=>{
        animations.flip(cardBack,holeCard,xFin2+cardW/2,yLocStart,cardW,cardH,n,20,inc,ctx,()=>{
          ctx.clearRect(xFin2,yLocStart,cardW,cardH);//clears last flipped image
          // anictx.clearRect(xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of ani
          ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of animation edge cases
          animations.slide(holeCard,xFin2,yLocStart,xLocStart,yLocStart,cardW,cardH,30,0,anictx,()=>{
            strokeAndFillText(gctx,'BlackJack!',cWidth/2,yLocStart+cardH/2,cWidth);
            //Welcome to Callback Hell. It's not so bad here
            playingGame = false;
            checkingCard = false;
            drawButtons();
            cb();
            // if(pHand.value==21){push(pHand);}
            // else{dealerWins();}
          });//end slide2
        })//end flip
      });//end slide1
    }else{
      animations.slide(cardBack,xFin,yLocStart,xLocStart,yLocStart,cardW,cardH,20,20,ctx,()=>{
        ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);
        checkingCard = false;
        drawButtons();
      })
    }
  });

}

function resolveInsurance(){
  //dealer peak animation
  console.log('resolving insurance');
  insuranceOpt = false;
  gctx.clearRect(0,cHeight*0.3,cWidth,cHeight*0.4);//Clears Insurance? display


  checkDealerBlackJack(cb());
  function cb(){
    if(dHand.value==21){
      if(insured==true){
        //animation here
        account.balance+=account.bet;
        drawButtons();
        displayBalance();
      }
      if(pHand.value==21){push(pHand);}
      else{dealerWins();}
      }
    }

}

function split(){
  let newBalance = account.balance-account.bet;
  if(pHandsArr.length<splitUpTo&&newBalance>=0){
    let currentHand = pHandsArr[curHand];
    hasSplit = true;
    account.balance = newBalance;
    let splitHand = new Hand(currentHand.cards.splice(1,1));//splits hand
    hit(currentHand)//draws on first hand
    hit(splitHand);//draws on second hand
    pHandsArr.push(splitHand);
    createpHandsXLocs();
    ctx.clearRect(0,cHeight/2,cWidth,cHeight/2);//clear card images
    bctx.clearRect(0,0,cWidth,cHeight);//clears chips stacks
    checkBlackJack(currentHand);
    drawPHandsArr();
    displayBetChips();
    displayBalance();
  }else{console.log("can't split")}
}

function createpHandsXLocs(){
  let numHands = pHandsArr.length;
  let xDis = cWidth/(numHands+1);
  pHandXLocs.splice(0,pHandXLocs.length);
  for(let i = 1, j=numHands+1; i<j; i++){
    pHandXLocs.push(Math.floor(xDis*i));
  }
}

function hit(hand){
  hand.cards.push(draw());
  calcHandValue(hand);
}

function doubleDown(){
  console.log('double down');
  account.balance-=account.bet;
  pHand.bet = 2*account.bet;
  pHand.double = true;
  hit(pHand);
  displayBalance();
  displayBetChips();
}

function stand(){
  //Loops through player's hands if split
  let nextHand = curHand+1;
  if(hasSplit&&(nextHand)<pHandsArr.length){
    curHand = nextHand;
    pHand = pHandsArr[curHand];
    checkBlackJack(pHand);
    drawButtons();
  }else{
    // playersTurn=false;
    if(checkingCard==false){
      dealerAction();
    }
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
    bust(hand);
  }
  else if(hand.double){stand()}
}

function dealerAction(){
  //dealer hits on anything less than 17 and soft 17
  drawDHand();
  while(dHand.value<17||(dHand.value==17&&dHand.numAces>0)){
    hit(dHand);
    drawDHand();
  }
  console.log('dealer action');

  playingGame=false;
  findWinner();
}

function findWinner(){
  pHandsArr.map(hand=>{
    let pValue = hand.value,
      dValue = dHand.value;

    if(hand.surrendered){
      console.log(surrendered);
    }else if(hand.blackJack){
      playerBJ(hand);
    }else if(pValue>21){
      console.log('Player busts')
    }else if(pValue>dValue&&pValue<22){
      console.log('player wins');
      playerWins(hand);
    }else if(pValue<22&&dValue>21){
      console.log('Dealer busts. Player wins');
      playerWins(hand);
    }else if(pValue===dValue){
      console.log('push');
      push(hand);
    }else{console.log('dealer wins');dealerWins();}
  })
  drawPlayBetBtns();
}
