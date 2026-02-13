import { useCallback, useEffect } from 'react';
import { CardType } from './card';
import { useSearchParams } from 'react-router';
import { useModal } from '../../app/ModalProvider';
import { CardSmall } from './smallcards/CardSmall';

export function Cards({cards}: {cards: CardType[]}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setModal } = useModal();

  const closeCard = useCallback(() => {
    setSearchParams(search => {
      const newParams = new URLSearchParams(search);
      newParams.delete("inspect");
      return newParams;
    })
  }, []);

  useEffect(() => {
    const cardInspected = parseInt(searchParams.get("inspect") || "");
    if(cardInspected) {
      const card = cards.find(card => card.id == cardInspected) || cards[0];

      setModal(
        {
            type: "inspect",
            card,
        },
        closeCard
      );
    }
    else {
      setModal(null, null);
    }
  }, [searchParams, setModal, cards, closeCard]);

  return (
    <>
      {cards.map(card =>
        <CardSmall card={card} key={card.id} />
      )}
    </>
  )
}