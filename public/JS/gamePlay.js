"use strict";

let pHandsArr = [];
let curHand = 0;
let hasSplit = false;
let rebet = false;
let playingGame = false;
let insuranceOpt = false;
let checkingCard = false;

function Hand(cards = [], val = 0, nAces = 0) {
  this.cards = cards;
  this.value = val;
  this.numAces = nAces;
  this.bet = account.bet;
}

let pHand, dHand;

/**
 * Start a new game using async/await
 * @returns {Promise} Promise that resolves when game is started
 */
async function newGame() {
  const wait = 20;

  if (shoe.length < cutCard) {
    createShoe();
  }
  
  rebet = true;
  pHandsArr = [];
  pHand = new Hand();
  dHand = new Hand();

  curHand = 0;
  hasSplit = false;
  pHandsArr[0] = pHand;

  createpHandsXLocs(); // required due to splitting

  try {
    await hit(dHand, 0, null, false);
    await hit(pHand, wait);
    await hit(dHand, 2 * wait);
    await hit(pHand, 3 * wait, curHand, true);
    
    displayPValue();
    displayBetChips();

    const exposedCardVal = dHand.cards[1][0];
    if (exposedCardVal === 'A') {
      insuranceOpt = true;
      checkingCard = true;
      glassBtnCanvas.style.zIndex = -1;
      drawButtons();
    } else if (exposedCardVal === '1') {
      await checkDealerBlackJack();
    } else {
      playingGame = true;
      checkBlackJack(pHand);
      glassBtnCanvas.style.zIndex = -1;
    }
  } catch (error) {
    console.error('Error starting new game:', error);
  }
}

function checkBlackJack(hand, playingHand = true) {
  // players hand only
  if (hand.value === 21 && hand.cards.length === 2) {
    hand.blackJack = true;
    console.log('BlackJack');
    const numHands = pHandsArr.length;
    if (numHands === 1) {
      playingGame = false;
      strokeAndFillText(gctx, 'BlackJack!', cWidth / 2, cHeight - cardH * 0.7);
    } else {
      drawPHandsArr(); // need to write BlackJack to hand. Can't simplify well
    }
    if (playingHand) {
      stand();
    }
  }
  drawButtons();
}

/**
 * Check dealer blackjack using async/await
 * @returns {Promise} Promise that resolves when check is complete
 */
async function checkDealerBlackJack() {
  insuranceOpt = false;
  checkingCard = true;
  drawButtons();
  const wait = 20;
  const reveal = dHand.value === 21;

  try {
    // Animation
    await revealDealerCard(reveal, wait);
    
    strokeAndFillText(gctx, 'BlackJack!', cWidth / 2, cHeight * 0.05 + cardH / 2, cWidth);
    playingGame = false;
    checkingCard = false;
    if (pHand.value === 21) {
      strokeAndFillText(gctx, 'BlackJack!', cWidth / 2, cHeight - cardH * 0.7);
    }
    await findWinner();
    drawButtons();
  } catch (error) {
    console.error('Error checking dealer blackjack:', error);
  }
}

function createpHandsXLocs() {
  const numHands = pHandsArr.length;
  const xDis = cWidth / (numHands + 1);
  pHandXLocs.splice(0, pHandXLocs.length);
  for (let i = 1, j = numHands + 1; i < j; i++) {
    pHandXLocs.push(Math.floor(xDis * i));
  }
}

function calcHandValue(hand) {
  hand.numAces = 0;
  let sum = 0;
  hand.cards.forEach(card => {
    const n = card.slice(0, 1);
    let v;
    if (n === 'A') {
      hand.numAces += 1;
      v = 11;
    } else if (n === 'J' || n === 'Q' || n === 'K' || n === '1') {
      v = 10;
    } else {
      v = parseInt(n);
    }
    sum += v;
  });
  
  // reduces handValue if over 21 with aces
  while (sum > 21 && hand.numAces > 0) {
    sum -= 10;
    hand.numAces -= 1;
  }
  hand.value = sum;
  if (sum > 21) {
    glassBtnCanvas.style.zIndex = 99;
    bust(hand);
  } else if (hand.double) {
    stand();
  }
}

/**
 * Dealer action using async/await
 * @returns {Promise} Promise that resolves when dealer action is complete
 */
async function dealerAction() {
  playingGame = false;
  glassBtnCanvas.style.zIndex = 99;
  console.log('dealer action');
  
  try {
    // animate card flip
    await revealDealerCard(true);
    displayDValue();
    await dealerHit();
  } catch (error) {
    console.error('Error in dealer action:', error);
  }

  // dealer hits on less than 17 and soft 17
  async function dealerHit() {
    if (dHand.value < 17 || (dHand.value === 17 && dHand.numAces > 0)) {
      await hit(dHand, 0, 0, true, disctx);
      displayDValue();
      await dealerHit();
    } else {
      await findWinner();
    }
  }
}

/**
 * Find winner using async/await for cleanup
 * @returns {Promise} Promise that resolves when winner is determined
 */
async function findWinner() {
  const outcomes = [];
  
  for (let i = 0, n = pHandsArr.length; i < n; i++) {
    const cnv = document.createElement('canvas');
    cnv.id = 'canvas' + i;
    document.body.appendChild(cnv);
    setDefCanvasProps(cnv.id, i);

    const chipctx = cnv.getContext('2d');
    const hand = pHandsArr[i];
    const pValue = hand.value;
    const dValue = dHand.value;

    if (hand.surrendered) {
      console.log('surrendered');
      outcomes.push(dealerWins(i, chipctx));
    } else if (hand.blackJack) {
      outcomes.push(playerBJ(i, chipctx));
    } else if (pValue > 21) {
      console.log('Player busts');
      outcomes.push(dealerWins(i, chipctx));
    } else if (pValue > dValue && pValue < 22) {
      outcomes.push(playerWins(i, chipctx));
    } else if (pValue < 22 && dValue > 21) {
      console.log('Dealer busts.');
      outcomes.push(playerWins(i, chipctx));
    } else if (pValue === dValue) {
      outcomes.push(push(i, chipctx));
    } else {
      outcomes.push(dealerWins(i, chipctx));
    }
  }
  
  // Wait for all outcomes to complete, then clean up
  try {
    await Promise.all(outcomes);
    await aniLib.wait(globalRate * 3);
    removeCanvases(pHandsArr.length);
    displayBalance();
    await discard();
  } catch (error) {
    console.error('Error in findWinner:', error);
  }
  
  drawPlayBetBtns();
}

/**
 * Discard cards using async/await
 * @returns {Promise} Promise that resolves when discard animation is complete
 */
async function discard() {
  gctx.clearRect(0, 0, cWidth, cHeight);
  disctx.clearRect(0, 0, cWidth, cHeight); // clears points and pointer
  ctx.clearRect(0, 0, cWidth, cHeight); // clears all drawn cards
  
  const rate = 60;
  const wait = Math.floor(rate / 6);
  const dCards = dHand.cards;
  const lenDHand = dCards.length;
  const xFin = -2 * cardW;
  const yFin = -2 * cardH;

  const dealerAnimations = [];
  
  // Animate dealer cards
  for (let i = 0; i < lenDHand; i++) {
    const dCard = cardImgMap.get(dCards[i]);
    const xLoc = dHandxLocStart - i * xCardDif;
    const yLoc = dHandyLocStart + i * yCardDif;

    const cnv = document.createElement('canvas');
    cnv.id = 'canvas' + i;
    document.body.appendChild(cnv);
    setDefCanvasProps(cnv.id, i);
    const dctx = cnv.getContext('2d');

    const d = lenDHand - i;
    dctx.drawImage(dCard, xLoc, yLoc, cardW, cardH); // redraws cards on new canvas
    dealerAnimations.push(aniLib.slide(dCard, xLoc, yLoc, xFin, yFin, cardW, cardH, rate, d * wait, dctx));
  }

  let n = lenDHand;
  const playerAnimations = [];
  
  // Animate player cards
  for (let i = 0, numHands = pHandsArr.length; i < numHands; i++) {
    const pCards = pHandsArr[i].cards;

    for (let j = 0, numCards = pCards.length; j < numCards; j++) {
      const cnv = document.createElement('canvas');
      cnv.id = 'canvas' + n;
      document.body.appendChild(cnv);
      n++;
      setDefCanvasProps(cnv.id, n);
      const dctx = cnv.getContext('2d');

      const pCard = cardImgMap.get(pCards[j]);
      const xLoc = pHandXLocs[i] - cardW / 2 + j * xCardDif;
      const yLoc = pHandYLocs - j * yCardDif;
      const d = numCards - j + i;

      dctx.drawImage(pCard, xLoc, yLoc, cardW, cardH);
      
      const animation = aniLib.slide(pCard, xLoc, yLoc, xFin, yFin, cardW, cardH, rate, d * wait, dctx);
      
      // Special handling for the last card
      if (i === numHands - 1 && j === numCards - 1) {
        animation.then(() => {
          removeCanvases(n);
          glassBtnCanvas.style.zIndex = -1;
        });
      }
      
      playerAnimations.push(animation);
    }
  }
  
  // Wait for all animations to complete
  await Promise.all([...dealerAnimations, ...playerAnimations]);
}
