import { render, screen } from "@testing-library/react";
import { CardType } from "../features/cards/card";
import { ComponentProps } from "react";
import { CardSmall } from "../features/cards/smallcards/CardSmall";
import CardsListRouteLayout, { clientLoader } from "./cardslist";

jest.mock("../features/cards/smallcards/CardSmall", () => ({
  __esModule: true,
  CardSmall: ({card} : ComponentProps<typeof CardSmall>) => <div>A small card: {card.name}</div>
}));

jest.mock("react-router", () => ({
  __esModule: true,
  Outlet: ({context} : {context: []}) => <div>Cards passed: {context.length}</div>
}));

describe("cardslist Route", () => {
  let loaderData : {cards: CardType[]};
  let defaultProps : ComponentProps<typeof CardsListRouteLayout>;

  beforeEach(async () => {
    loaderData = { cards: [{
            id: 10,
            name: "Test Title",
            description: "",
            image: "",
            rarity: 3,
            quantity: 1,
        },{
            id: 11,
            name: "Test Card 2",
            description: "",
            image: "",
            rarity: 5,
            quantity: 10,
        }]
    };
    defaultProps = {
        loaderData: loaderData,
    };

    fetchMock.resetMocks();
    fetchMock.mockResponse(
        JSON.stringify({ data: 100 })
    );
  });

  describe("clientLoader", () => {
    test("fetches data from supabase", async () => {
      await clientLoader();
      expect(process.env.SUPABASE_URL).not.toEqual(""); // Sanity check
      expect(process.env.SUPABASE_ANON_KEY).not.toEqual(""); // Sanity check
      expect(fetchMock).toHaveBeenCalledWith(`${process.env.SUPABASE_URL}/functions/v1/getCards`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
              },
          });
    })

    test("returns data from supabase", async () => {
      return expect(clientLoader()).resolves.toEqual({ cards: { data: 100 } });
    })
  });

  test("renders a list of cards", async () => {
    render(<CardsListRouteLayout {...defaultProps} loaderData={loaderData} />);
    return expect(screen.findByText("Cards passed: 2")).resolves.toBeInTheDocument();
  });
});