import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/mycards";
import { CardType } from "../features/cards/card";
import { createClient, FunctionsError } from "@supabase/supabase-js";
import getAuth from "../app/auth.client";
import { ShouldRevalidateFunction, useOutletContext, useSearchParams } from "react-router";
import { Cards } from "../features/cards/Cards";

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "");

export type MyCardsLoaderProps = {
  inventory: {[key: string]: number},
  userId: string | null,
};

const OK = "ok";
const PENDING = "pending";
type SupabaseResponse = {
  data: {
    status: typeof OK,
    inventory: {[key: string]: number},
  } | {
    status: typeof PENDING,
  } | null,
  error: FunctionsError | null
};

export async function clientLoader() {
  const { userId } = await getAuth();

  if(!userId) return null;

  const { data } : SupabaseResponse = await supabase.functions.invoke("getInventory", {
    body: { userId }
  });

  const inventory = data?.status == OK ? data.inventory : {};
  return {
      inventory,
      userId
  } as MyCardsLoaderProps
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

export default function MyCardsRoute({ loaderData } : Route.ComponentProps) {
  const inCards : CardType[] = useOutletContext();
  if(!loaderData || !inCards)
      return <div />;

  const { userId } = loaderData;
  if(!userId)
      return <div>Allow the app permissions.</div>;

  const [inventory, setInventory] = useState(loaderData.inventory);
  useEffect(() => {
    const channel = supabase.channel(`viewer-events:${userId}`)
      .on("broadcast", {
          event: "inventory_update",
        },
        (payload) => {
          setInventory(payload.inventory);
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [userId]);

  const [params] = useSearchParams();
  const onlyowned = (params.get("onlyowned") === "true");

  const [cards, fewerCards] = useMemo(() =>
    inCards.reduce((acc, card) => {
      const newCard = {...card, quantity: inventory[card.name]||0};
      acc[0].push(newCard);
      if(newCard.quantity) acc[1].push(newCard);
      return acc;
    }, [[] as CardType[], [] as CardType[]]),
    [inCards, inventory]
  );

  return <Cards cards={onlyowned ? fewerCards : cards} />;
}