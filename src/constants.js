const CONTRACT_ADDRESS = '0x31c1e7515C3F4a190bd3A3821FdA61d4cDB07269';

/*
* Add this method and make sure to export it on the bottom!
*/
const transformCharacterData = (characterData) => {
 return {
   name: characterData.name,
   imageURI: characterData.imageURI,
   hp: characterData.hp.toNumber(),
   maxHp: characterData.maxHp.toNumber(),
   attackDamage: characterData.attackDamage.toNumber(),
 };
};

export { CONTRACT_ADDRESS, transformCharacterData };