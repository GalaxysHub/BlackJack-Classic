"use strict";

/**
 * Hit function using async/await
 * @param {Object} hand - The hand object
 * @param {number} wait - Wait time
 * @param {number} handNum - Hand number
 * @param {boolean} flip - Whether to flip the card
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @returns {Promise} Promise that resolves when hit animation completes
 */
async function hit(hand, wait = 0, handNum = curHand, flip = true, cvs = anictx) {
  glassBtnCanvas.style.zIndex = 99;
  const rate = 30;
  const numCards = hand.cards.length;
  let xLoc, yLoc;

  const card = draw();
  hand.cards.push(card);

  const cardBack = miscImgMap.get('WhiteRabbitBack');
  const cardPic = cardImgMap.get(card);

  if (hand === dHand) {
    xLoc = dHandxLocStart - numCards * xCardDif;
    yLoc = dHandyLocStart + numCards * yCardDif;
  } else {
    xLoc = pHandXLocs[handNum] - cardW / 2 + numCards * xCardDif;
    yLoc = pHandYLocs - numCards * yCardDif;
  }

  const inc = 2 * cardW / rate;
  
  try {
    await aniLib.slide(cardBack, cWidth + cardW, -cardH, xLoc, yLoc, cardW, cardH, rate, wait, cvs);
    
    if (flip) {
      await aniLib.flip(cardBack, cardPic, xLoc + cardW / 2, yLoc, cardW, cardH, rate, 0, inc, cvs);
      cvs.clearRect(0, 0, cWidth, cHeight);
      ctx.drawImage(cardPic, xLoc, yLoc, cardW, cardH);
      calcHandValue(hand);
      displayPointer();
      displayPValue();
    } else {
      ctx.drawImage(cardBack, xLoc, yLoc, cardW, cardH);
    }
  } catch (error) {
    console.error('Error in hit animation:', error);
  }
}

/**
 * Double down function using async/await
 * @returns {Promise} Promise that resolves when double down is complete
 */
async function doubleDown() {
  glassBtnCanvas.style.zIndex = 99;
  console.log('double down');
  pHand.double = true;
  const amt = account.bet;
  account.balance -= amt;
  pHand.bet = 2 * amt;
  displayBalance();

  // animations
  const chipLoc = pHandXLocs[curHand] - cardW;
  
  try {
    await slideChipStack(0, anictx, chipLoc, -chipLoc, yLocPlayer, 0, 0, () => {}, amt);
    drawChips(0, 2 * amt, chipLoc);
    await hit(pHand, 0, curHand, true);
  } catch (error) {
    console.error('Error in double down:', error);
  }
}

/**
 * Stand function (player only function) using async/await
 * @returns {Promise} Promise that resolves when stand is complete
 */
async function stand() {
  glassBtnCanvas.style.zIndex = 99;
  
  try {
    // Loops through player's hands if split
    const nextHand = curHand + 1;
    if (hasSplit && (nextHand) < pHandsArr.length) {
      curHand = nextHand;
      pHand = pHandsArr[curHand];
      if (pHand.blackJack === true) {
        await stand();
      } else {
        glassBtnCanvas.style.zIndex = -1;
      }
      displayPValue();
      displayPointer();
    } else {
      if (checkingCard === false) {
        await dealerAction();
      }
      drawButtons();
    }
  } catch (error) {
    console.error('Error in stand:', error);
  }
}

/**
 * Insurance function using async/await
 * @returns {Promise} Promise that resolves when insurance is complete
 */
async function insurance() {
  glassBtnCanvas.style.zIndex = 99;
  const amt = account.bet / 2;
  account.balance -= amt;
  
  // animations
  const chipLoc = pHandXLocs[0] - 2 * cardW;
  
  try {
    await slideChipStack(0, anictx, chipLoc, -chipLoc, yLocPlayer, 0, 0, () => {}, amt);
    drawChips(0, amt, chipLoc);
    await checkDealerBlackJack();
    await resolveInsurance();
  } catch (error) {
    console.error('Error in insurance:', error);
  }
}

/**
 * Split function using async/await
 * @returns {Promise} Promise that resolves when split is complete
 */
async function split() {
  glassBtnCanvas.style.zIndex = 99;
  disctx.clearRect(0, cHeight * 0.9, cWidth, cHeight * 0.1); // clears pValue
  gctx.clearRect(0, 0, cWidth, cHeight);

  const rate = globalRate;
  const newBalance = account.balance - account.bet;

  if (pHandsArr.length < splitUpTo && newBalance >= 0) {
    const oripHandsXLocs = pHandXLocs.slice(0, pHandXLocs.length);
    hasSplit = true;
    account.balance = newBalance;
    
    try {
      // animations
      const currentHand = pHandsArr[curHand];
      const splitHand = new Hand(currentHand.cards.splice(1, 1)); // splits hand
      pHandsArr.splice(curHand + 1, 0, splitHand);

      createpHandsXLocs();
      
      // adds canvas for each hand animation
      for (let handNum = 0, j = oripHandsXLocs.length; handNum < j; handNum++) {
        const cnv = document.createElement('canvas');
        cnv.id = 'canvas' + handNum;
        document.body.appendChild(cnv);
        setDefCanvasProps(cnv.id, handNum);

        const splitctx = cnv.getContext('2d');
        splitctx.fillStyle = 'white';
        splitctx.textAlign = 'center';
        splitctx.textBaseline = 'middle';
        splitctx.font = bctx.font;

        if (handNum === curHand) { // creates split hand
          const oriXPos = oripHandsXLocs[curHand] - cardW / 2;
          const splitCardImg1 = cardImgMap.get(currentHand.cards[0]);
          const splitCardImg2 = cardImgMap.get(splitHand.cards[0]);
          const xLoc1 = pHandXLocs[curHand] - cardW / 2;
          const xLoc1Fin = pHandXLocs[curHand] - cardW / 2;
          const xLoc2 = pHandXLocs[curHand + 1] - cardW / 2;
          const xDif = xLoc1 - oriXPos;
          const chipLoc1 = oriXPos - cardW / 2;
          const chipLoc2 = pHandXLocs[curHand + 1] - cardW;

          // hand 1
          await slideHandProps(handNum, splitctx, pHand, chipLoc1, xLoc1Fin, oriXPos, xLoc1, xDif);

          // hand 2
          await aniLib.slide(splitCardImg2, oriXPos + xCardDif, pHandYLocs - yCardDif, xLoc2, pHandYLocs, cardW, cardH, rate, 0, anictx);
          
          ctx.drawImage(splitCardImg2, xLoc2, pHandYLocs, cardW, cardH);
          removeCanvases(oripHandsXLocs.length);
          drawPHandsArr(); // draws final cards and conditions
          displayPointer();

          await slideChipStack(curHand + 1, sctx, chipLoc2, -chipLoc2, cHeight / 2, 0, 0, () => {}, account.bet);
          
          drawChips(handNum, account.bet, chipLoc2);
          
          await hit(currentHand, 0, curHand, true);
          checkBlackJack(currentHand);
          
          await hit(splitHand, 20, curHand + 1, true);
          glassBtnCanvas.style.zIndex = -1;
          checkBlackJack(splitHand, false);
        }
      }
      
      displayBalance();
      displayPointer();
    } catch (error) {
      console.error('Error in split:', error);
    }
  }
}

/**
 * Rebet chip function using async/await
 * @returns {Promise} Promise that resolves when rebet animation is complete
 */
async function rebetChip() {
  try {
    const chipLoc = pHandXLocs[0] - cardW;
    await slideChipStack(0, anictx, chipLoc, -chipLoc, cHeight / 2, 0, 0, () => {}, account.bet);
    drawChips(0, account.bet, chipLoc);
  } catch (error) {
    console.error('Error in rebetChip:', error);
  }
}
