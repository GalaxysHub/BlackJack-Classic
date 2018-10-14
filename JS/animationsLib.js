"use strict";

const aniLib = (()=>{

  function slide(img,xStart,yStart,xFin,yFin,w,h,n,s,cvs,callback=()=>{}){

    if(s>0){//Delays execution by s frames
      requestAnimationFrame(()=>{slide(img,xStart,yStart,xFin,yFin,w,h,n,s-1,cvs,callback)});
    }else{
      let dx = (xFin-xStart)/n, dy = (yFin-yStart)/n;//division is computional expensive; better to do this once

      slideABit(img,xStart,yStart,xFin,yFin,w,h,n,cvs,callback);
      function slideABit(img,xStart,yStart,xFin,yFin,w,h,n,cv,callback){
        let x = xStart+dx, y = yStart+dy; //If not linear solve equation here
        cvs.clearRect(Math.floor(x-dx-1),Math.floor(y-dy-1),w+2,h+2);//Erases last image; handles edge cases
        cvs.drawImage(img,Math.floor(x),Math.floor(y),w,h);

        if(n>1){
          requestAnimationFrame(()=>{slideABit(img,x,y,xFin,yFin,w,h,n-1,cvs,callback)});
        }else{callback();}
      }
    }
  }

  function flip(img1,img2,x,y,w,h,n,s,inc,ctx,callback=()=>{}){
    if(s>0){//Delays execution by s frames
      requestAnimationFrame(()=>{flip(img1,img2,x,y,w,h,n,s-1,inc,ctx,callback)})
    }else{
      w-=inc;
      if(w>0){
        ctx.clearRect(x-w-1,y-1,2*w+2,h+2);
        ctx.drawImage(img1,x-w/2,y,w,h);
      }
      else{ctx.drawImage(img2,x-w/2,y,w,h);}
      if(n>1){
        requestAnimationFrame(()=>{flip(img1,img2,x,y,w,h,n-1,s,inc,ctx,callback)})
      }else{callback();}
    }
  }

  function slideCanvas(ctx=ctx,xStart,yStart,xFin,yFin,n,s,fn=()=>{},callback=()=>{}){
    let dx, dy;

    if(s>0){requestAnimationFrame(()=>{slideCanvas(ctx=ctx,xStart,yStart,xFin,yFin,n,s-1,fn,callback)});
    }else{shift(ctx,xStart,yStart,xFin,yFin,n,fn,callback);}

    function shift(ctx,xStart,yStart,xFin,yFin,n,fn,cb){
      if(n>0){
        ctx.translate(xStart,yStart);
        dx = (xFin-xStart)/n;
        dy = (yFin-yStart)/n;
        slide(ctx,n,fn,cb);
      }
    }
    function slide(ctx,n,fn,cb){
      if(n>0){
        ctx.translate(dx,dy);
        fn();
        requestAnimationFrame(()=>{slide(ctx,n-1,fn,cb)});
      }else{cb();}
    }
  }

  function fadeOut(text,ctx,a,x,y,dir,font,callback=()=>{}){
    ctx.font = font //make dynamic
    ctx.clearRect(x-200,y-100,400,200);
    ctx.globalAlpha = a;

    if(a>0){
      a-=0.02;
      if(dir=="up"){
        ctx.fillStyle = 'green';
        ctx.fillText('+'+text,x,y);
        y-=1;
      }else{
        ctx.fillStyle = 'red';
        ctx.fillText('-'+text,x,y);
        y+=1;
      }
      window.requestAnimationFrame(()=>{
        fadeOut(text,ctx,a,x,y,dir,callback);
      });
    }else{
      ctx.globalAlpha = 1;
      callback();
    }
  }

  return{
    slide:slide,
    flip: flip,
    slideCanvas: slideCanvas,
    fadeOut:fadeOut
  }

})()
