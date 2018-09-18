"use strict";

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

  // if(checkingCard===false){//replace with canClick later
    if(insuranceOpt===true){
      if(isInside(mousePos,optionButtonsMap.get('Yes'))){
        console.log('yes clicked');
        insured = true;
        account.balance-=account.bet/2;
        //animation here
        resolveInsurance();
      }else if(isInside(mousePos,optionButtonsMap.get('No'))){
        console.log('no clicked');
        insured = false;
        resolveInsurance();
      }
      drawButtons();
    }else{
      if(checkingCard==false){
        if(playingGame===true){
          if(isInside(mousePos,optionButtonsMap.get('Hit'))){
            hit(pHand);
            drawPHandsArr();
            drawButtons();
            console.log(pHand.value);
            let totHands = pHandsArr.length;
            if(pHand.value==21){stand();}
            if(pHand.value>20&&curHand==totHands){
              drawPlayBetBtns();
              dealerAction();
            }
          }else if(isInside(mousePos,optionButtonsMap.get('Stand'))){stand();
          }else if(pHand.cards.length==2){
            if(isInside(mousePos,optionButtonsMap.get('Double'))){
              doubleDown();
              drawPHandsArr();
            }
            else if(isInside(mousePos,optionButtonsMap.get('Surrender'))){surrender(pHand);}
            else if(pHand.cards[0][0]==pHand.cards[1][0]&&isInside(mousePos,optionButtonsMap.get('Split'))){
              split();
            }
          }
          displayPointer();
          displayPValue();
        }else{
          //options for new hand
          if(isInside(mousePos,optionButtonsMap.get('Play'))&&account.bet>=minBet){
            console.log('PlayGame');
            playingGame = true;
            newGame();
            displayBetChips();//move later
            displayBalance();
          }else if(rebet===false){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              pHand.bet = account.bet=0;
              console.log('bet cleared');
            }
            //Changes bet based on chips selected
            chipBtnMap.forEach(chip=>{
              if(isInside(mousePos,chip)){
                account.bet+=chip.v;
                pHand.bet = account.bet;
              }
            })
            displayBetChips();
          }else if(rebet===true){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              rebet=false;
              account.bet = 0;
              pHand.bet = 0
              console.log('bet cleared');
              drawPlayBetBtns();
              displayBetChips();
            }
          }
        }
      }
    }


},false);
