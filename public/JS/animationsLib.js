"use strict";

const aniLib = (() => {

  /**
   * Slide animation using promises
   * @param {Image} img - Image to animate
   * @param {number} xStart - Starting X position
   * @param {number} yStart - Starting Y position
   * @param {number} xFin - Final X position
   * @param {number} yFin - Final Y position
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {number} n - Number of frames
   * @param {number} s - Delay frames
   * @param {CanvasRenderingContext2D} cvs - Canvas context
   * @returns {Promise} Promise that resolves when animation completes
   */
  function slide(img, xStart, yStart, xFin, yFin, w, h, n, s, cvs) {
    return new Promise((resolve) => {
      if (s > 0) {
        // Delay execution by s frames
        requestAnimationFrame(() => {
          slide(img, xStart, yStart, xFin, yFin, w, h, n, s - 1, cvs).then(resolve);
        });
      } else {
        const dx = (xFin - xStart) / n;
        const dy = (yFin - yStart) / n;
        
        slideABit(img, xStart, yStart, xFin, yFin, w, h, n, cvs, resolve);
        
        function slideABit(img, xStart, yStart, xFin, yFin, w, h, n, cvs, callback) {
          const x = xStart + dx;
          const y = yStart + dy;
          
          // Erase last image; handles edge cases
          cvs.clearRect(Math.floor(x - dx - 1), Math.floor(y - dy - 1), w + 2, h + 2);
          cvs.drawImage(img, Math.floor(x), Math.floor(y), w, h);

          if (n > 1) {
            requestAnimationFrame(() => {
              slideABit(img, x, y, xFin, yFin, w, h, n - 1, cvs, callback);
            });
          } else {
            callback();
          }
        }
      }
    });
  }

  /**
   * Flip animation using promises
   * @param {Image} img1 - First image
   * @param {Image} img2 - Second image
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {number} n - Number of frames
   * @param {number} s - Delay frames
   * @param {number} inc - Increment value
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @returns {Promise} Promise that resolves when animation completes
   */
  function flip(img1, img2, x, y, w, h, n, s, inc, ctx) {
    return new Promise((resolve) => {
      if (s > 0) {
        // Delay execution by s frames
        requestAnimationFrame(() => {
          flip(img1, img2, x, y, w, h, n, s - 1, inc, ctx).then(resolve);
        });
      } else {
        w -= inc;
        if (w > 0) {
          ctx.clearRect(x - w - 1, y - 1, 2 * w + 2, h + 2);
          ctx.drawImage(img1, x - w / 2, y, w, h);
        } else {
          ctx.drawImage(img2, x - w / 2, y, w, h);
        }
        
        if (n > 1) {
          requestAnimationFrame(() => {
            flip(img1, img2, x, y, w, h, n - 1, s, inc, ctx).then(resolve);
          });
        } else {
          resolve();
        }
      }
    });
  }

  /**
   * Canvas slide animation using promises
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} xStart - Starting X
   * @param {number} yStart - Starting Y
   * @param {number} xFin - Final X
   * @param {number} yFin - Final Y
   * @param {number} n - Number of frames
   * @param {number} s - Delay frames
   * @param {Function} fn - Function to call during animation
   * @returns {Promise} Promise that resolves when animation completes
   */
  function slideCanvas(ctx, xStart, yStart, xFin, yFin, n, s, fn = () => {}) {
    return new Promise((resolve) => {
      if (s > 0) {
        requestAnimationFrame(() => {
          slideCanvas(ctx, xStart, yStart, xFin, yFin, n, s - 1, fn).then(resolve);
        });
      } else {
        shift(ctx, xStart, yStart, xFin, yFin, n, fn, resolve);
      }

      function shift(ctx, xStart, yStart, xFin, yFin, n, fn, cb) {
        if (n > 0) {
          ctx.translate(xStart, yStart);
          const dx = (xFin - xStart) / n;
          const dy = (yFin - yStart) / n;
          slideStep(ctx, n, dx, dy, fn, cb);
        }
      }
      
      function slideStep(ctx, n, dx, dy, fn, cb) {
        if (n > 0) {
          ctx.translate(dx, dy);
          fn();
          requestAnimationFrame(() => {
            slideStep(ctx, n - 1, dx, dy, fn, cb);
          });
        } else {
          cb();
        }
      }
    });
  }

  /**
   * Fade out animation using promises
   * @param {string} text - Text to fade out
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} a - Alpha value
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} dir - Direction ("up" or "down")
   * @param {string} font - Font string
   * @returns {Promise} Promise that resolves when animation completes
   */
  function fadeOut(text, ctx, a, x, y, dir, font) {
    return new Promise((resolve) => {
      ctx.font = font;
      
      function animateFrame() {
        ctx.clearRect(x - 200, y - 100, 400, 200);
        ctx.globalAlpha = a;

        if (a > 0) {
          a -= 0.02;
          if (dir === "up") {
            ctx.fillStyle = 'green';
            ctx.fillText('+' + text, x, y);
            y -= 1;
          } else {
            ctx.fillStyle = 'red';
            ctx.fillText('-' + text, x, y);
            y += 1;
          }
          requestAnimationFrame(animateFrame);
        } else {
          ctx.globalAlpha = 1;
          resolve();
        }
      }
      
      animateFrame();
    });
  }

  /**
   * Wait function using promises
   * @param {number} n - Number of frames to wait
   * @returns {Promise} Promise that resolves after waiting
   */
  function wait(n) {
    return new Promise((resolve) => {
      if (n > 0) {
        requestAnimationFrame(() => {
          wait(n - 1).then(resolve);
        });
      } else {
        resolve();
      }
    });
  }

  return {
    slide,
    flip,
    slideCanvas,
    fadeOut,
    wait
  };

})();
