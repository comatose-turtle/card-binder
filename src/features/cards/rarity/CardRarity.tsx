import 'react'
import './CardRarity.css'
import images from "../../../app/imageHelper";

const rarityDisplay = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'mythic',
];

interface RarityProps {
  rarity: number
}

export function CardRarity({ rarity }: RarityProps) {
  return (
    <div className='rarity'>
      <div className={'glow ' + rarityDisplay[rarity-1]} />
      <img src={images[`${rarityDisplay[rarity-1]}.png`]} />
    </div>
  )
}