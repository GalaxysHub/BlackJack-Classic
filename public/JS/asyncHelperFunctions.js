"use strict";

const asyncHelperFunctions = (() => {
  
  /**
   * Creates an array of promises for loading images
   * @param {Array} pictures - Array of image file names
   * @param {Map} imgMap - Map to store loaded images
   * @param {string} loc - Location path for images
   * @returns {Array} Array of promises
   */
  function createPromImgArr(pictures, imgMap, loc) {
    return pictures.map((imgName) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          imgMap.set(imgName.split('.')[0], img);
          resolve(img);
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${imgName}`));
        };
        
        img.src = loc + imgName;
      });
    });
  }

  /**
   * Async function to load all images
   * @param {Array} pictures - Array of image file names  
   * @param {Map} imgMap - Map to store loaded images
   * @param {string} loc - Location path for images
   * @returns {Promise} Promise that resolves when all images are loaded
   */
  async function loadImages(pictures, imgMap, loc) {
    try {
      const imagePromises = createPromImgArr(pictures, imgMap, loc);
      await Promise.all(imagePromises);
      return imgMap;
    } catch (error) {
      console.error('Error loading images:', error);
      throw error;
    }
  }

  /**
   * Async function to load fonts
   * @param {Array} fonts - Array of font strings to load
   * @returns {Promise} Promise that resolves when all fonts are loaded
   */
  async function loadFonts(fonts) {
    try {
      // Wait for document fonts to be ready
      await document.fonts.ready;
      
      // Check if fonts are available, if not wait a bit more
      const fontPromises = fonts.map(font => {
        return new Promise((resolve) => {
          // Try to load the font with a fallback approach
          const testElement = document.createElement('div');
          testElement.style.fontFamily = font.split(' ').slice(1).join(' ');
          testElement.style.position = 'absolute';
          testElement.style.visibility = 'hidden';
          testElement.textContent = 'Test';
          document.body.appendChild(testElement);
          
          // Clean up and resolve
          setTimeout(() => {
            document.body.removeChild(testElement);
            resolve();
          }, 100);
        });
      });
      
      await Promise.all(fontPromises);
      return true;
    } catch (error) {
      console.error('Error loading fonts:', error);
      // Don't throw error, just continue without custom fonts
      return false;
    }
  }

  return {
    createPromImgArr,
    loadImages,
    loadFonts
  };

})();
