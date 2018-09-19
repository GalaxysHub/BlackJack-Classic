

//player only
function bust(hand){
  console.log('bust');
  hand.bust = true;
  if(hand==pHand){
    if(pHandsArr.length==1){
      strokeAndFillText(gctx,'Bust',cWidth/2,pHandYLocs+cardH/2);
      console.log('drawing bust');
    }else{
      drawPHandsArr();
    }
    stand();
  }else if(hand==dHand){
    strokeAndFillText(gctx,"Bust",cWidth/2,cHeight*0.1+cardH/2);
  }
}

function surrender(hand){
  hand.surrendered = true;
  stand();
}

function playerBJ(hand){
  //animation here
  console.log('player blackjack')
  account.balance+=2.5*hand.bet;
  displayBalance();
}
function playerWins(hand){
  //animation here
  console.log('player wins');
  account.balance+=2*hand.bet;
  displayBalance();
}

function dealerWins(hand){
  //animation here
  console.log('dealer wins');
}

function push(hand){
  //animation here
  console.log('push');
  account.balance+=hand.bet;
  displayBalance();
}
