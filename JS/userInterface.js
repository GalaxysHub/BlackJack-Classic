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
    if(insuranceOpt===true){
      if(isInside(mousePos,optionButtonsMap.get('Yes'))){
        console.log('yes clicked');
        if(checkBalance(account.bet/2)){
          //animation here
          account.balance-=account.bet/2;
          checkDealerBlackJack(resolveInsurance());
        }
      }else if(isInside(mousePos,optionButtonsMap.get('No'))){
        console.log('no clicked');
        checkDealerBlackJack();
      }
      drawButtons();
    }else{
      gctx.clearRect(0,cHeight*0.3,cWidth,cHeight*0.4);//in case insufficient balance is displayed
      if(checkingCard==false){
        if(playingGame===true){
          if(isInside(mousePos,optionButtonsMap.get('Hit'))){
            hit(pHand);
            drawPHandsArr();
            drawButtons();
            console.log(pHand.value);
            let totHands = pHandsArr.length;
            if(pHand.value>20){
              stand();
            }
          }else if(isInside(mousePos,optionButtonsMap.get('Stand'))){
            stand();
          }else if(pHand.cards.length==2){
            if(isInside(mousePos,optionButtonsMap.get('Double'))){
              if(checkBalance(account.bet)){
                doubleDown();
                drawPHandsArr();
              }
            }
            else if(isInside(mousePos,optionButtonsMap.get('Surrender'))){surrender(pHand);}
            else if(pHand.cards[0][0]==pHand.cards[1][0]&&isInside(mousePos,optionButtonsMap.get('Split'))){
              if(checkBalance(account.bet)){split();}
            }
          }
          displayPointer();
          displayPValue();
        }else{
          //options for new hand
          if(isInside(mousePos,optionButtonsMap.get('Play'))&&account.bet>=minBet){
              if(checkBalance(account.bet)){
              console.log('PlayGame');
              playingGame = true;
              newGame();
              displayBalance();
            }
          }else if(rebet===false){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              pHand.bet = account.bet=0;
              console.log('bet cleared');
            }
            //Changes bet based on chips selected
            chipBtnMap.forEach(chip=>{
              if(isInside(mousePos,chip)){
                let newBet = account.bet+chip.v;
                if(checkBalance(newBet)==true){
                  pHand.bet = account.bet = newBet;
                }
              }
            })
          }else if(rebet===true){
            if(isInside(mousePos,optionButtonsMap.get('Clear Bet'))){
              rebet=false;
              pHand.bet = account.bet = 0;
              console.log('bet cleared');
            }
          }
          displayBetChips();
          drawButtons();
        }
      }
    }


},false);
