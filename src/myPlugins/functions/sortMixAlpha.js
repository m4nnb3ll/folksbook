export default function sortMixAlpha(str1, str2, i=0) {
  // to stop the recursion
  if (!str1[i] || !str2[i]) return
  
  // put 'toLowerCase()' to sort alphabetically not using ASCII order
  return ( 
    str1[i].toLowerCase() < str2[i].toLowerCase()
    ? str1 + str2
    : str1[i].toLowerCase() > str2[i].toLowerCase()
      ? str2 + str1
      : sortMixAlpha(str1, str2, ++i)
  );
};