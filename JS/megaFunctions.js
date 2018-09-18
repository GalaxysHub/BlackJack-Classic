"use strict";
const fpa = 50;

let fstTime = true;
function slideChipStack(dir, chipStack, chipsArr, cb=()=>{}, wait=0, n=fpa,ctx=tctx, orictx = anictx, cnv = transCanvas){
  let xStart, yStart, xFin, yFin;
  let posArr = [];
  chipStack.forEach(stack=> {posArr.push(checkChipStackType(stack));})

  switch(dir){
    case 'bottomUp': xStart = -cWidth/2; yStart = cHeight; xFin = 0; yFin= 0; break;
    case 'midUp': xStart = 0; yStart = 0; xFin = cWidth/2; yFin = -cHeight; break;
    case 'topDown': xStart = cWidth/2; yStart = -cHeight; xFin = 0; yFin = 0; break;
    case 'midDown': xStart = 0; yStart = 0; xFin = -cWidth/2; yFin = cHeight; break;
    default: console.log('direction not specified');
  }

  ctx.save();
  cnv.style.zIndex = 3;
  animations.slideCanvas(ctx, cnv, xStart, yStart, xFin, yFin, n, wait, ()=>{
    if(fstTime&&(dir=='midUp'||dir=='midDown')){
      fstTime = false;
      posArr.forEach(pos => orictx.clearRect(xBetLocsArr[pos]-chipW,0,chipW*2,cHeight));
    }
    //operations to perform with each translation
    ctx.clearRect(0,-cHeight,cWidth,2*cHeight);//2*height in case chipstack exceed cHeight
    for(let i = 0, j = posArr.length; i<j; i++) {
      displayBetChips(chipsArr[i],xBetLocsArr[posArr[i]],ctx);
    }
  },()=>{//callback function
    cnv.style.zIndex = -10;
    ctx.restore();
    fstTime = true;
    cb();
  });
}

function checkChipStackType(chipStack){
  switch(chipStack){
    case 'Pair+': return 0;
    case 'Ante': return 1;
    case 'Play': return 2;
    default: console.log('chipstack not selected');
  }
}
