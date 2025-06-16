"use strict";

const globalRate = 40;
const globalWait = Math.floor(globalRate / 2);

/**
 * Slide chip stack animation using async/await
 * @param {number} handNum - Hand number
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @param {number} chipLoc - Chip location
 * @param {number} xStart - Starting X position
 * @param {number} yStart - Starting Y position
 * @param {number} xFin - Final X position
 * @param {number} yFin - Final Y position
 * @param {Function} fn - Function to call during animation
 * @param {number|null} val - Value
 * @param {number} wait - Wait time
 * @returns {Promise} Promise that resolves when animation completes
 */
async function slideChipStack(handNum, cvs, chipLoc, xStart, yStart, xFin, yFin, fn = () => {}, val = null, wait = 0) {
  const rate = globalRate;
  
  await aniLib.slideCanvas(cvs, xStart, yStart, xFin, yFin, rate, wait, () => {
    fn();
    cvs.clearRect(0, 0, cWidth, cHeight);
    drawChips(handNum, val, chipLoc, cvs, false);
  });
  
  cvs.clearRect(0, 0, cWidth, cHeight);
}

/**
 * Slide hand properties animation using async/await
 * @param {number} n - Hand number
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @param {Object} thisHand - Hand object
 * @param {number} chipLoc - Chip location
 * @param {number} chipLocFin - Final chip location
 * @param {number} oriXPos - Original X position
 * @param {number} xPos - X position
 * @param {number} xDif - X difference
 * @param {number|null} bet - Bet amount
 * @returns {Promise} Promise that resolves when animation completes
 */
async function slideHandProps(n, cvs, thisHand, chipLoc, chipLocFin, oriXPos, xPos, xDif, bet = null) {
  const rate = globalRate;
  
  await aniLib.slideCanvas(cvs, 0, 0, xDif, 0, rate, 0, () => {
    cvs.clearRect(0, 0, cWidth, cHeight);
    drawChips(n, bet, chipLoc, cvs);
    drawPHand(thisHand, oriXPos, cvs);
  });
  
  drawChips(n, bet);
}

/**
 * Reveal dealer card animation using async/await
 * @param {boolean} reveal - Whether to reveal the card
 * @param {number} wait - Wait time
 * @returns {Promise} Promise that resolves when animation completes
 */
async function revealDealerCard(reveal, wait = 0) {
  const xLocStart = cWidth / 2 - cardW / 2;
  const yLocStart = cHeight * 0.05;
  const xFin = xLocStart + cardW / 2;
  const xFin2 = xLocStart + cardW;

  const cardBack = miscImgMap.get('WhiteRabbitBack');
  const holeCard = cardImgMap.get(dHand.cards[0]);
  const exposedCard = cardImgMap.get(dHand.cards[1]);

  // Redraw image because of animation edge cases
  disctx.drawImage(exposedCard, xLocStart - xCardDif, yLocStart + yCardDif, cardW, cardH);
  
  await aniLib.slide(cardBack, xLocStart, yLocStart, xFin, yLocStart, cardW, cardH, 20, 0, ctx);
  
  if (reveal === true) {
    const n = 15;
    const inc = (2 * cardW) / n;
    
    await aniLib.slide(cardBack, xFin, yLocStart, xFin2, yLocStart, cardW, cardH, 10, wait, ctx);
    
    await aniLib.flip(cardBack, holeCard, xFin2 + cardW / 2, yLocStart, cardW, cardH, n, wait, inc, ctx);
    
    // Clear last flipped image
    ctx.clearRect(xFin2, yLocStart, cardW, cardH);
    
    await aniLib.slide(holeCard, xFin2, yLocStart, xLocStart, yLocStart, cardW, cardH, 30, 0, ctx);
    
    ctx.drawImage(exposedCard, xLocStart - xCardDif, yLocStart + yCardDif, cardW, cardH);
    // Clear initial drawn exposed card
    disctx.clearRect(0, 0, cWidth, cHeight);
  } else {
    await aniLib.slide(cardBack, xFin, yLocStart, xLocStart, yLocStart, cardW, cardH, 20, 20, ctx);
    
    ctx.drawImage(exposedCard, xLocStart - xCardDif, yLocStart + yCardDif, cardW, cardH);
    checkingCard = false;
    checkBlackJack(pHand);
    drawButtons();
    glassBtnCanvas.style.zIndex = -1;
  }
}
