
const globalRate = 40;
const globalWait = Math.floor(globalRate/2);

function slideChipStack(handNum,cvs,chipLoc,xStart,yStart,xFin,yFin,fn=()=>{},cb=()=>{},val=null,wait=0){
  let rate = globalRate;
  aniLib.slideCanvas(cvs,xStart,yStart,xFin,yFin,rate,wait,()=>{
    fn();
    cvs.clearRect(0,0,cWidth,cHeight);
    drawChips(handNum,val,chipLoc,cvs,false);
  },()=>{
    cb();
    cvs.clearRect(0,0,cWidth,cHeight);
  });
}

function slideHandProps(n,cvs,thisHand,chipLoc,chipLocFin,oriXPos,xPos,xDif,bet=null){
  let rate = globalRate;
  aniLib.slideCanvas(cvs,0,0,xDif,0,rate,0,()=>{
    cvs.clearRect(0,0,cWidth,cHeight);

    drawChips(n,bet,chipLoc,cvs);
    drawPHand(thisHand,oriXPos,cvs);
  },()=>{
    drawChips(n,bet);
  });
}

function revealDealerCard(reveal,cb=()=>{},wait=0){
  let xLocStart = cWidth/2-cardW/2,
    yLocStart = cHeight*0.05,
    xFin = xLocStart+cardW/2,
    xFin2 = xLocStart+cardW;

  let cardBack = miscImgMap.get('WhiteRabbitBack');
  let holeCard = cardImgMap.get(dHand.cards[0])
  let exposedCard = cardImgMap.get(dHand.cards[1]);

  disctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of animation edge cases
  aniLib.slide(cardBack,xLocStart,yLocStart,xFin,yLocStart,cardW,cardH,20,0,ctx,()=>{
    if(reveal==true){
      let n = 15
      let inc = (2*cardW)/n;
      aniLib.slide(cardBack,xFin,yLocStart,xFin2,yLocStart,cardW,cardH,10,wait,ctx,()=>{
        aniLib.flip(cardBack,holeCard,xFin2+cardW/2,yLocStart,cardW,cardH,n,wait,inc,ctx,()=>{
          ctx.clearRect(xFin2,yLocStart,cardW,cardH);//clears last flipped image
          aniLib.slide(holeCard,xFin2,yLocStart,xLocStart,yLocStart,cardW,cardH,30,0,ctx,()=>{
            ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);// have to redraw image because of animation edge cases
            disctx.clearRect(0,0,cWidth,cHeight);//clears initial drawn exposed card
            cb();
          });//end slide2
        })//end flip
      });//end slide1
    }else{
      aniLib.slide(cardBack,xFin,yLocStart,xLocStart,yLocStart,cardW,cardH,20,20,ctx,()=>{
        ctx.drawImage(exposedCard,xLocStart-xCardDif,yLocStart+yCardDif,cardW,cardH);
        checkingCard = false;
        checkBlackJack(pHand);
        drawButtons();
        glassBtnCanvas.style.zIndex = -1
      })
    }
  });
}
