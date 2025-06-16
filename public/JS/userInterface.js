"use strict";

function getMousePos(cvn, evt) {
  const rect = cvn.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function isInside(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.w && pos.y < rect.y + rect.h && pos.y > rect.y;
}

btnCanvas.addEventListener('click', async function(evt) {
  const mousePos = getMousePos(btnCanvas, evt);
  
  if (insuranceOpt === true) {
    if (isInside(mousePos, optionButtonsMap.get('Yes'))) {
      gctx.clearRect(0, 0, cWidth, cHeight);
      console.log('yes clicked');
      if (checkBalance(account.bet / 2)) {
        await insurance();
      }
    } else if (isInside(mousePos, optionButtonsMap.get('No'))) {
      gctx.clearRect(0, 0, cWidth, cHeight);
      console.log('no clicked');
      await checkDealerBlackJack();
    }
  } else {
    gctx.clearRect(0, cHeight * 0.3, cWidth, cHeight * 0.4); // in case insufficient balance is displayed
    if (checkingCard === false) {
      if (playingGame === true) {
        if (isInside(mousePos, optionButtonsMap.get('Hit'))) {
          await hit(pHand, 0, curHand, true);
          if (pHand.value < 21) {
            glassBtnCanvas.style.zIndex = -1;
          } else if (pHand.value === 21) {
            stand();
          }
          drawButtons();
        } else if (isInside(mousePos, optionButtonsMap.get('Stand'))) {
          stand();
        } else if (pHand.cards.length === 2) {
          if (isInside(mousePos, optionButtonsMap.get('Double'))) {
            if (checkBalance(account.bet)) {
              await doubleDown();
            }
          } else if (isInside(mousePos, optionButtonsMap.get('Surrender'))) {
            surrender(pHand);
          } else if (pHand.cards[0][0] === pHand.cards[1][0] && isInside(mousePos, optionButtonsMap.get('Split'))) {
            if (checkBalance(account.bet)) {
              await split();
            }
          }
        }
        if (!isInside(mousePos, optionButtonsMap.get('Split'))) {
          displayPointer();
        }
      } else {
        // options for new hand
        if (isInside(mousePos, optionButtonsMap.get('Play')) && account.bet >= minBet) {
          if (checkBalance(account.bet)) {
            glassBtnCanvas.style.zIndex = 99;
            playingGame = true;
            if (rebet === true) {
              await rebetChip();
              await newGame();
            } else {
              await newGame();
              account.balance -= account.bet;
            }
            displayBalance();
          }
        } else if (rebet === false) {
          if (isInside(mousePos, optionButtonsMap.get('Clear Bet'))) {
            pHand.bet = account.bet = 0;
            bctx.clearRect(0, 0, cWidth, cHeight);
            drawPlayBetBtns();
          }
          
          // Changes bet based on chips selected
          for (const chip of chipBtnMap.values()) {
            if (isInside(mousePos, chip)) {
              const newBet = account.bet + chip.v;

              if (checkBalance(newBet) === true) {
                pHand.bet = account.bet = newBet;
                
                try {
                  await aniLib.slide(
                    chipImgMap.get(chip.s), 
                    chip.x, 
                    cHeight, 
                    cWidth / 2 - cardW, 
                    chipYLoc, 
                    chipW, 
                    chipH, 
                    25, 
                    0, 
                    bctx
                  );
                  
                  bctx.clearRect(cWidth / 2 - cardW - 1, 0, chipW + 2, cHeight); // clears edge case
                  drawChips();
                } catch (error) {
                  console.error('Error in chip animation:', error);
                }
              }
            }
          }
          drawPlayBetBtns();
        } else if (rebet === true) {
          if (isInside(mousePos, optionButtonsMap.get('Clear Bet'))) {
            rebet = false;
            pHand.bet = account.bet = 0;
            bctx.clearRect(0, 0, cWidth, cHeight);
            drawPlayBetBtns();
          }
        }
      }
    }
  }
}, false);
