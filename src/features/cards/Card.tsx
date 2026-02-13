import 'react'
import './Card.css'
import images from "../../app/imageHelper";
import type { CardType } from './card'
import { CardTitle } from './title/CardTitle';
import { CardRarity } from './rarity/CardRarity';

interface CardProps {
  card: CardType,
  big?: boolean
}

export function Card({ card, big=false }: CardProps) {
  return (
    <div className={'card' + (big ? ' big-card' : '')}>
      <div className='card-content-container'>
        <div className='image-container'>
          <img src={images[card.image]} style={{maxWidth: "100%", maxHeight: "100%"}} />
        </div>
        <CardTitle name={card.name} />
        <CardRarity rarity={card.rarity} />
        <div className='description'>{card.description}</div>
        <div className='quantity'>{card.quantity > 0 ? `Owned x${card.quantity}` : 'Not owned'}</div>
      </div>
    </div>
  )
}