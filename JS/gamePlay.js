"use strict";

let pHandsArr = [];
let curHand;
let lastBet;
let hasSplit = false;
let rebet = true;
let playingGame = true;
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
  ctx.clearRect(0,0,cWidth,cHeight);
  anictx.clearRect(0,0,cWidth,cHeight);
  bctx.clearRect(0,0,cWidth,cHeight);//clears chip stacks. aniLib should render obselete
  disctx.clearRect(0,0,cWidth,cHeight);
  gctx.clearRect(0,0,cWidth,cHeight);

  curHand = 0;
  hasSplit = false;

  playingGame = true;
  pHandsArr[0] = pHand;

  // drawDHandStart();
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
      drawButtons();
    }else if(exposedCardVal=='1'){
      checkDealerBlackJack();
    }else{
      playingGame = true;
      checkBlackJack(pHand)
    }

  });

}

function checkBlackJack(hand){//players hand only
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
    stand();
  }
  drawButtons();
}

function checkDealerBlackJack(cb=()=>{}){
  gctx.clearRect(0,0,cWidth,cHeight*0.4);
  insuranceOpt = false;

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
  aniLib.slide(cardBack,xLocStart,yLocStart,xFin,yLocStart,cardW,cardH,20,0,ctx,()=>{
    if(dHand.value==21){
      let n = 15
      let inc = (2*cardW)/n;
      aniLib.slide(cardBack,xFin,yLocStart,xFin2,yLocStart,cardW,cardH,10,20,ctx,()=>{
        aniLib.flip(cardBack,holeCard,xFin2+cardW/2,yLocStart,cardW,cardH,n,20,inc,ctx,()=>{
          ctx.clearRect(xFin2,yLocStart,cardW,cardH);//clears last flipped image
          // anictx.clearRect(xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of ani
          ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of animation edge cases
          aniLib.slide(holeCard,xFin2,yLocStart,xLocStart,yLocStart,cardW,cardH,30,0,anictx,()=>{
            strokeAndFillText(gctx,'BlackJack!',cWidth/2,yLocStart+cardH/2,cWidth);
            //Welcome to Callback Hell. It's not so bad here
            playingGame = false;
            checkingCard = false;
            if(pHand.value==21){
              //replaces checkBlackJack function
              strokeAndFillText(gctx,'BlackJack',cWidth/2,cHeight-cardH*0.7);
              push(pHand);
            }else{
              dealerWins();
            }
            cb();
            drawButtons();
          });//end slide2
        })//end flip
      });//end slide1
    }else{
      aniLib.slide(cardBack,xFin,yLocStart,xLocStart,yLocStart,cardW,cardH,20,20,ctx,()=>{
        ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);
        checkingCard = false;
        checkBlackJack(pHand);
        drawButtons();
      })
    }
  });
}

function resolveInsurance(){
  if(dHand.value==21){
    console.log('insurance payout')
    //animation here
    
    account.balance+=account.bet;
    drawButtons();
    displayBalance();
  }else{
    //animation here
  }
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
    bust(hand);
  }
  else if(hand.double){stand()}
}

function dealerAction(){
  //dealer hits on less than 17 and soft 17
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
      dealerWins();
    }else if(hand.blackJack){
      playerBJ(hand);
    }else if(pValue>21){
      console.log('Player busts')
      dealerWins();
    }else if(pValue>dValue&&pValue<22){
      playerWins(hand);
    }else if(pValue<22&&dValue>21){
      console.log('Dealer busts.');
      playerWins(hand);
    }else if(pValue===dValue){
      push(hand);
    }else{
      dealerWins();
    }
  })
  drawPlayBetBtns();
}

function discard(){
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
        console.log('n',n);
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
            console.log(n);
            removeCanvases(n);
          }
        });
    }
  }
}
