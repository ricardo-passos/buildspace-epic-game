type CharacterAttributes = {
  name: string
  imageURI: string
  hp: {
    _hex: string
  }
  maxHp: {
    _hex: string
  }
  attackDamage: {
    _hex: string
  }
  timesMinted: {
    _hex: string
  }
}

function formatCharacterAttributes(characterAttributes: CharacterAttributes[]) {
  return characterAttributes.map(
    ({ name, imageURI, hp, maxHp, attackDamage, timesMinted }) => ({
      name,
      imageURI,
      hp: parseInt(hp._hex),
      maxHp: parseInt(maxHp._hex),
      attackDamage: parseInt(attackDamage._hex),
      timesMinted: parseInt(timesMinted._hex),
    })
  )
}

export { formatCharacterAttributes }
