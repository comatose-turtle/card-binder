import { render, screen } from "@testing-library/react";
import { CardType } from "../features/cards/card";
import { ComponentProps } from "react";
import CardsListRouteLayout, { clientLoader } from "./cardslist";
import { createRoutesStub, useOutletContext } from "react-router";
import { CardList } from "../features/cards/CardList";

jest.mock("../features/cards/CardList", () => ({
  __esModule: true,
  CardList: ({children} : ComponentProps<typeof CardList>) => <div><span>A list of cards</span>{children}</div>
}));

describe("cardslist Route", () => {
  let loaderData : {cards: CardType[]};

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
    });

    test("returns data from supabase", async () => {
      return expect(clientLoader()).resolves.toEqual({ cards: { data: 100 } });
    });
  });

  describe("component", () => {
    let Component : ReturnType<typeof createRoutesStub>;
    const ChildComponent = () => {
      const context = useOutletContext<CardType[]>();
      return <div>Cards passed: {context.length}</div>;
    }
    // const CatchingComponent = () => {
    //   try {
    //     return <CardsListRouteLayout loaderData={loaderData} />
    //   } catch(e) {
    //     console.log(e);
    //     return <div>CAUGHT!!</div>
    //   }
    // }

    beforeEach(() => {
      Component = createRoutesStub([{
        path: "/mycards",
        Component: CardsListRouteLayout,
        loader: () => loaderData,
        HydrateFallback: () => <div />,
        children: [{
          index: true,
          Component: ChildComponent,
        }]
      }]);
    });

    test("renders a list of cards", async () => {
      render(<Component initialEntries={["/mycards"]} />);
      return Promise.all([
        expect(screen.findByText("A list of cards")).resolves.toBeInTheDocument(),
        expect(screen.findByText("Cards passed: 2")).resolves.toBeInTheDocument()
      ]);
    });
  });
});