import "react";
import { CardType } from "../features/cards/card";
import { useOutletContext } from "react-router";
import { Cards } from "../features/cards/Cards";

export default function AllCardsRoute({}) {
    const cards : CardType[] = useOutletContext();
    if(!cards)
        return <div />;

    return <Cards cards={cards} />;
}