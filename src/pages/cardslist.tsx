import { CardList } from "../features/cards/CardList";
import { Outlet, ShouldRevalidateFunction } from "react-router";
import { CardType } from "../features/cards/card";

type CardsListLoaderProps = {
  cards: CardType[],
};
export async function clientLoader() {
    const res = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/getCards`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            },
        }
    );
    const cards : CardType[] = await res.json();

    return {
        cards
    } satisfies CardsListLoaderProps
}

export const shouldRevalidate : ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  if (
    currentUrl.pathname === nextUrl.pathname
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function CardsListRouteLayout({ loaderData } : {loaderData: CardsListLoaderProps}) {
  if(!loaderData)
      return <div />;

  const { cards } = loaderData as CardsListLoaderProps;

  return (
    <CardList>
        <Outlet context={cards} />
    </CardList>
  );
}