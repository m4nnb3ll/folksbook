export default function getObjKeys(obj) {
  if(!obj) return undefined;
  const keys = [];
  for(let key in obj) {
    keys.push(key);
  }
  return keys;
}