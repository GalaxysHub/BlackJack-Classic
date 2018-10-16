//yLocs hardcoded based on chipStack yLoc
const yLocPlayer = cHeight*0.7;
const xLocDealer = cWidth*0.75;
const yLocDealer = cHeight*0.7;

function bust(hand){
  console.log('bust');
  hand.bust = true;
  if(hand==pHand){
    if(pHandsArr.length==1){
      strokeAndFillText(gctx,'Bust',cWidth/2,pHandYLocs+cardH/2);
      console.log('drawing bust');
    }else{
      drawPHandsArr();//resizes font. Wasteful
    }
    stand();
  }
  else if(hand==dHand){
    strokeAndFillText(gctx,"Bust",cWidth/2,cHeight*0.1+cardH/2);
  }
}

//player only
function surrender(hand){
  hand.surrendered = true;
  stand();
}

function playerBJ(i,cvs,cb=()=>{}){
  console.log('player blackjack')
  let bet = pHandsArr[i].bet
  let win = 2.5*bet;
  account.balance+=win;

  let chipLoc = pHandXLocs[i]-cardW;
  //animation
  slideChipStack(i,cvs,chipLoc,xLocDealer-chipLoc,-yLocDealer,0,0,()=>{},()=>{
    drawChips(i,win,chipLoc)
    slideChipStack(i,cvs,chipLoc,0,0,-chipLoc,yLocPlayer,()=>{
      bctx.clearRect(chipLoc,0,chipW,cHeight);
    },()=>{
      cb();
    },win,globalWait);
  },1.5*bet);
}

function playerWins(i,cvs,cb=()=>{}){
  console.log('player wins');
  let bet = pHandsArr[i].bet
  let win = 2*bet;
  account.balance+=win;

  if(pHandsArr.length==1){strokeAndFillText(gctx,'Player Wins',cWidth/2,cHeight/2);}

  let chipLoc = pHandXLocs[i]-cardW;
  //animation
  slideChipStack(0,cvs,chipLoc,xLocDealer-chipLoc,-yLocDealer,0,0,()=>{},()=>{
    drawChips(i,win,chipLoc)
    slideChipStack(0,cvs,chipLoc,0,0,-chipLoc,yLocPlayer,()=>{
      bctx.clearRect(chipLoc,0,chipW,cHeight);
    },()=>{
      cb();
    },win,globalWait);
  },bet);
}

function dealerWins(i,cvs){
  console.log('dealer wins');
  let chipLoc = pHandXLocs[i]-cardW;
  let bet = pHandsArr[i].bet

  if(pHandsArr.length==1){strokeAndFillText(gctx,'Dealer Wins',cWidth/2,cHeight/2);}

  //animation
  slideChipStack(0,cvs,chipLoc,0,0,xLocDealer-chipLoc,-yLocDealer,()=>{
    bctx.clearRect(chipLoc,0,chipW,cHeight);
  },()=>{},bet);

}

function push(i,cvs,cb=()=>{}){
  console.log('push');
  let bet = pHandsArr[i].bet
  let chipLoc = pHandXLocs[i]-cardW;
  account.balance+=bet;

  if(pHandsArr.length==1){strokeAndFillText(gctx,'Push',cWidth/2,cHeight/2);}

  //animation
  slideChipStack(0,cvs,chipLoc,0,0,-chipLoc,yLocPlayer,()=>{
    bctx.clearRect(chipLoc,0,chipW,cHeight);
  },()=>{},bet);

}

function resolveInsurance(){
  let chipLoc = pHandXLocs[0]-2*cardW;
  let amt = account.bet
  account.balance+=amt;
  if(dHand.value==21){
    console.log('insurance payout')
    //Animations
    slideChipStack(0,sctx,chipLoc,chipLoc,-yLocDealer,0,0,()=>{},()=>{
      bctx.clearRect(chipLoc,0,chipW,cWidth);
      drawChips(0,amt,chipLoc);
      slideChipStack(0,sctx,chipLoc,0,0,-chipLoc,cHeight/2,()=>{
        bctx.clearRect(chipLoc,0,chipW,cWidth);
      },()=>{
        glassBtnCanvas.style.zIndex = -1;
        sctx.translate(chipLoc,-cHeight/2)
      },amt,globalWait)
    },amt/2,);
    drawButtons();
  }else{
    //Animations
    slideChipStack(0,sctx,chipLoc,0,0,xLocDealer-chipLoc,-yLocDealer,()=>{},()=>{
      glassBtnCanvas.style.zIndex = -1;
      sctx.translate(-chipLoc,yLocDealer)
    },amt/2);
  }
}
