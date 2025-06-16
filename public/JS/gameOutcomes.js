"use strict";

// yLocs hardcoded based on chipStack yLoc
const yLocPlayer = cHeight * 0.7;
const xLocDealer = cWidth * 0.75;
const yLocDealer = cHeight * 0.7;

function bust(hand) {
  hand.bust = true;
  if (hand === pHand) {
    if (pHandsArr.length === 1) {
      strokeAndFillText(gctx, 'Bust', cWidth / 2, pHandYLocs + cardH / 2);
      console.log('drawing bust');
    } else {
      drawPHandsArr(); // resizes font. Wasteful
    }
    stand();
  } else if (hand === dHand) {
    strokeAndFillText(gctx, "Bust", cWidth / 2, cHeight * 0.1 + cardH / 2);
  }
}

// player only
function surrender(hand) {
  hand.surrendered = true;
  stand();
}

/**
 * Player BlackJack outcome using async/await
 * @param {number} i - Hand index
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @returns {Promise} Promise that resolves when animation completes
 */
async function playerBJ(i, cvs) {
  console.log('player blackjack');
  const bet = pHandsArr[i].bet;
  const win = 2.5 * bet;
  account.balance += win;

  const chipLoc = pHandXLocs[i] - cardW;
  
  try {
    // animation
    await slideChipStack(i, cvs, chipLoc, xLocDealer - chipLoc, -yLocDealer, 0, 0, () => {}, 1.5 * bet);
    
    drawChips(i, win, chipLoc);
    
    await slideChipStack(i, cvs, chipLoc, 0, 0, -chipLoc, yLocPlayer, () => {
      bctx.clearRect(chipLoc, 0, chipW, cHeight);
    }, win, globalWait);
  } catch (error) {
    console.error('Error in playerBJ animation:', error);
  }
}

/**
 * Player wins outcome using async/await
 * @param {number} i - Hand index
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @returns {Promise} Promise that resolves when animation completes
 */
async function playerWins(i, cvs) {
  console.log('player wins');
  const bet = pHandsArr[i].bet;
  const win = 2 * bet;
  account.balance += win;

  if (pHandsArr.length === 1) {
    strokeAndFillText(gctx, 'Player Wins', cWidth / 2, cHeight / 2);
  }

  const chipLoc = pHandXLocs[i] - cardW;
  
  try {
    // animation
    await slideChipStack(0, cvs, chipLoc, xLocDealer - chipLoc, -yLocDealer, 0, 0, () => {}, bet);
    
    drawChips(i, win, chipLoc);
    
    await slideChipStack(0, cvs, chipLoc, 0, 0, -chipLoc, yLocPlayer, () => {
      bctx.clearRect(chipLoc, 0, chipW, cHeight);
    }, win, globalWait);
  } catch (error) {
    console.error('Error in playerWins animation:', error);
  }
}

/**
 * Dealer wins outcome using async/await
 * @param {number} i - Hand index
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @returns {Promise} Promise that resolves when animation completes
 */
async function dealerWins(i, cvs) {
  console.log('dealer wins');
  const chipLoc = pHandXLocs[i] - cardW;
  const bet = pHandsArr[i].bet;

  if (pHandsArr.length === 1) {
    strokeAndFillText(gctx, 'Dealer Wins', cWidth / 2, cHeight / 2);
  }

  try {
    // animation
    await slideChipStack(0, cvs, chipLoc, 0, 0, xLocDealer - chipLoc, -yLocDealer, () => {
      bctx.clearRect(chipLoc, 0, chipW, cHeight);
    }, bet);
  } catch (error) {
    console.error('Error in dealerWins animation:', error);
  }
}

/**
 * Push outcome using async/await
 * @param {number} i - Hand index
 * @param {CanvasRenderingContext2D} cvs - Canvas context
 * @returns {Promise} Promise that resolves when animation completes
 */
async function push(i, cvs) {
  console.log('push');
  const bet = pHandsArr[i].bet;
  const chipLoc = pHandXLocs[i] - cardW;
  account.balance += bet;

  if (pHandsArr.length === 1) {
    strokeAndFillText(gctx, 'Push', cWidth / 2, cHeight / 2);
  }

  try {
    // animation
    await slideChipStack(0, cvs, chipLoc, 0, 0, -chipLoc, yLocPlayer, () => {
      bctx.clearRect(chipLoc, 0, chipW, cHeight);
    }, bet);
  } catch (error) {
    console.error('Error in push animation:', error);
  }
}

/**
 * Resolve insurance using async/await
 * @returns {Promise} Promise that resolves when insurance is resolved
 */
async function resolveInsurance() {
  const chipLoc = pHandXLocs[0] - 2 * cardW;
  const amt = account.bet;
  account.balance += amt;
  
  try {
    if (dHand.value === 21) {
      console.log('insurance payout');
      // Animations
      await slideChipStack(0, sctx, chipLoc, chipLoc, -yLocDealer, 0, 0, () => {}, amt / 2);
      
      bctx.clearRect(chipLoc, 0, chipW, cWidth);
      drawChips(0, amt, chipLoc);
      
      await slideChipStack(0, sctx, chipLoc, 0, 0, -chipLoc, cHeight / 2, () => {
        bctx.clearRect(chipLoc, 0, chipW, cWidth);
      }, amt, globalWait);
      
      glassBtnCanvas.style.zIndex = -1;
      sctx.translate(chipLoc, -cHeight / 2);
      drawButtons();
    } else {
      // Animations
      await slideChipStack(0, sctx, chipLoc, 0, 0, xLocDealer - chipLoc, -yLocDealer, () => {}, amt / 2);
      
      glassBtnCanvas.style.zIndex = -1;
      sctx.translate(-chipLoc, yLocDealer);
    }
  } catch (error) {
    console.error('Error in resolveInsurance:', error);
  }
}
