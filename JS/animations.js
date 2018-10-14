
function slideChipStack(hand,cvs,xLoc,yLoc,cb=()=>{},bet=null,bet2=null){
  let rate = 30;
  aniLib.slideCanvas(cvs,-xLoc,yLoc,0,0,rate,0,()=>{
    cvs.clearRect(0,0,cWidth,cHeight);
    drawChips(hand,bet,xLoc,cvs,false);
  },()=>{
    cvs.clearRect(0,0,cWidth,cHeight);
    drawChips(hand,bet,xLoc);//draws chipstack to default canvas
    cb();
  });
}

function slideHandProps(n,cvs,thisHand,chipLoc,chipLocFin,oriXPos,xPos,xDif,bet=null){
  let rate = 30;
  aniLib.slideCanvas(cvs,0,0,xDif,0,rate,0,()=>{
    cvs.clearRect(0,0,cWidth,cHeight);

    drawChips(n,bet,chipLoc,cvs);
    drawPHand(thisHand,oriXPos,cvs);
  },()=>{
    drawChips(n,bet);
    // drawPHand(thisHand,xPos);
  });
}
