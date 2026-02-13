import 'react'
import '../Card.css'
import './CardSmall.css'
import images from "../../../app/imageHelper";
import type { CardType } from '../card'
import { CardTitle } from '../title/CardTitle';
import { CardRarity } from '../rarity/CardRarity';
import { Link, useSearchParams } from 'react-router';
import { useMemo } from 'react';

interface CardProps {
  card: CardType
}

export function CardSmall({ card }: CardProps) {
  const [searchParams, _] = useSearchParams();
  const linkTarget = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    params.set("inspect", card.id.toString());
    return { search: params.toString() };
  }, [searchParams]);

  return (
    <Link to={linkTarget} className='clickable-card' preventScrollReset >
      <div className={`small-card${card.quantity == 0 ? " greyed" : ""}`}>
        <div className='card-content-container'>
          <div className='image-container'>
            <img src={images[card.image]} style={{maxWidth: "100%", maxHeight: "100%"}} />
          </div>
          <CardTitle name={card.name} />
          <CardRarity rarity={card.rarity} />
          { card.quantity > 0 ?
            <div className='quantity'>x{card.quantity}</div>
            : null }
        </div>
      </div>
    </Link>
  )
}