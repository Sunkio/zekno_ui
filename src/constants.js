const CONTRACT_ADDRESS = '0xEB2572438Bb174EB60C0295534B3BbBE010ddE3b';
const TESTNET_CHAIN_ID = '0x6357d2e0';

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

export { CONTRACT_ADDRESS, TESTNET_CHAIN_ID, transformCharacterData };