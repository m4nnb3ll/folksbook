const spreadObj = (obj, params) => {
  let returned = [];
  for (let key in obj) {
    params && params.withId
      ? returned.push({id: key, ...obj[key]})
      : returned.push(obj[key]);
  }
  return returned;
};

export default spreadObj;