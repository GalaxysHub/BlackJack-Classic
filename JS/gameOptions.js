function hit(hand,wait=0,handNum=curHand,flip=true,cb=()=>{}){
  let rate = 30;
  let numCards = hand.cards.length
  let xLoc, yLoc;

  let card = draw();
  hand.cards.push(card);

  let cardBack = miscImgMap.get('WhiteRabbitBack');
  let cardPic = cardImgMap.get(card);

  if(hand==dHand){
    xLoc = dHandxLocStart-numCards*xCardDif;
    yLoc = dHandyLocStart+numCards*yCardDif
  }else{
    xLoc = pHandXLocs[handNum]-cardW/2+numCards*xCardDif;
    yLoc = pHandYLocs-numCards*yCardDif;
  }

  let inc = 2*cardW/rate;
  aniLib.slide(cardBack,cWidth+cardW,-cardH,xLoc,yLoc,cardW,cardH,rate,wait,disctx,()=>
  {
    if(flip){
      aniLib.flip(cardBack,cardPic,xLoc+cardW/2,yLoc,cardW,cardH,rate,0,inc,disctx,()=>{
        disctx.clearRect(0,0,cWidth,cHeight);
        ctx.drawImage(cardPic,xLoc,yLoc,cardW,cardH);
        calcHandValue(hand);
        displayPointer();
        displayPValue();
        cb();
      });
    }else{
      ctx.drawImage(cardBack,xLoc,yLoc,cardW,cardH);
      cb();
    }
  })
}

function doubleDown(){
  console.log('double down');
  account.balance-=account.bet;
  pHand.bet = 2*account.bet;
  //animations here
  pHand.double = true;
  hit(pHand,0,curHand,true,()=>{
    displayPValue();
  });
  displayBetChips();
  displayBalance();
}

function stand(){//player only function
  //Loops through player's hands if split
  let nextHand = curHand+1;
  if(hasSplit&&(nextHand)<pHandsArr.length){
    curHand = nextHand;
    pHand = pHandsArr[curHand];
    checkBlackJack(pHand);
    displayPValue();
    displayPointer();
  }else{
    if(checkingCard==false){
      dealerAction();
    }
    drawButtons();
  }
}

function insurance(){
  account.balance-=account.bet/2;
  //animation here
  let loc = pHandXLocs[0]-2*cardW;
  slideChipStack(0,anictx,loc,cHeight/2,()=>{
    checkDealerBlackJack(resolveInsurance());
  },account.bet/2)
}

function split(){
  gctx.clearRect(0,0,cWidth,cHeight);

  const rate = 30;
  let newBalance = account.balance-account.bet;

  if(pHandsArr.length<splitUpTo&&newBalance>=0){
    let oripHandsXLocs = pHandXLocs.slice(0,pHandXLocs.length);
    hasSplit = true;
    account.balance = newBalance;
    //animations
    console.log(oripHandsXLocs);
    let currentHand = pHandsArr[curHand];
    let splitHand = new Hand(currentHand.cards.splice(1,1));//splits hand
    pHandsArr.splice(curHand+1,0,splitHand);

    createpHandsXLocs();
    //adds canvas for each hand animation
    for(let handNum=0, j=oripHandsXLocs.length; handNum<j;handNum++){
      let cnv = document.createElement('canvas');
      cnv.id = 'canvas'+handNum;
      document.body.appendChild(cnv)
      setDefCanvasProps(cnv.id,handNum);

      let splitctx = cnv.getContext('2d');
      splitctx.fillStyle = 'white';
      splitctx.textAlign = 'center';
      splitctx.textBaseline = 'middle';
      splitctx.font = bctx.font;

      if(handNum==curHand){//creates split hand
        let oriXPos = oripHandsXLocs[curHand]-cardW/2;
        let splitCardImg1 = cardImgMap.get(currentHand.cards[0]);
        let splitCardImg2 = cardImgMap.get(splitHand.cards[0]);
        let xLoc1 = pHandXLocs[curHand]-cardW/2;
        let xLoc1Fin = pHandXLocs[curHand]-cardW/2;
        let xLoc2 = pHandXLocs[curHand+1]-cardW/2;
        let xDif = xLoc1-oriXPos;
        let chipLoc1 = oriXPos-cardW/2;
        let chipLoc2 = pHandXLocs[curHand+1]-cardW;
        console.log('chipLoc',chipLoc2);

        //hand 1
        slideHandProps(handNum,splitctx,pHand,chipLoc1,xLoc1Fin,oriXPos,xLoc1,xDif);

        //hand 2
        aniLib.slide(splitCardImg2,oriXPos+xCardDif,pHandYLocs-yCardDif,xLoc2,pHandYLocs,cardW,cardH,rate,0,anictx,()=>{
          ctx.drawImage(splitCardImg2,xLoc2,pHandYLocs,cardW,cardH);

          removeCanvases(oripHandsXLocs.length);
          displayPValue();
          drawPHandsArr();//draws final cards and conditions
          displayPointer();

          slideChipStack(curHand+1,sctx,chipLoc2,cHeight/2,()=>{
            hit(currentHand,0,curHand,true,()=>{
              checkBlackJack(currentHand);
            });
            hit(splitHand,20,curHand+1);//hits on second hand
          });

          anictx.clearRect(0,0,cWidth,cHeight);
        });

      }else{//moves other hands
        let n;
        if(handNum<curHand){n=handNum;}
        else{n=handNum+1;}

        splitctx.strokeRect(0,0,cWidth,cHeight);
        let thisHand = pHandsArr[n];
        console.log(thisHand);
        let chipLoc = oripHandsXLocs[handNum]-cardW;
        let chipLocFin = pHandsArr[handNum]-cardW;
        let oriXPos = oripHandsXLocs[handNum]-cardW/2;

        let xPos = pHandXLocs[n]-cardW/2;
        let xDif = xPos-oriXPos;
        slideHandProps(n,splitctx,thisHand,chipLoc,chipLocFin,oriXPos,xPos,xDif);
      }
    }
    console.log(pHandXLocs);

    ctx.clearRect(0,cHeight/2,cWidth,cHeight/2);//clear card images
    bctx.clearRect(0,0,cWidth,cHeight);//clears chips stacks
    displayBalance();

  }else{console.log("can't split")}

}
