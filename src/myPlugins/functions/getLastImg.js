/**
 * 
 * @param {Array of Objects} imgs 
 * @param {String} type 
 * @returns {Object}
 * 
 */

export default function getLastImg(imgs, type) {
  const allImgs = imgs.filter((img) => {
    return img.type === type;
  });

  return allImgs.length && allImgs[allImgs.length - 1];
}