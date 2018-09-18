

//player only
function bust(hand){
  console.log('bust');
  hand.bust = true;
  if(hand==pHand){
    if(pHandsArr.length!==1){
      gctx.font = Math.floor(cHeight/15)+"px TheBlacklist";
    }
    strokeAndFillText(gctx,'Bust',pHandXLocs[curHand],pHandYLocs+cardH/2);
    gctx.font = Math.floor(cHeight/6)+"px TheBlacklist";
  }else if(hand==dHand){
    strokeAndFillText(gctx,"Bust",cWidth/2,cHeight*0.1+cardH/2);
  }
  stand();
}

function surrender(hand){
  hand.surrendered = true;
  stand();
}

function playerBJ(hand){
  account.balance+=2.5*hand.bet;
}
function playerWins(hand){
  account.balance+=2*hand.bet;
}

function dealerWins(hand){

}

function push(hand){
  account.balance+=hand.bet;
}
