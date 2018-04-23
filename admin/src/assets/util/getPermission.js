export default function getPermission(modles,modleName) {
  for(var i=0;i<modles.length;i++) {
    if(modles[i].modleName==modleName)
      return modles[i];
  }
}