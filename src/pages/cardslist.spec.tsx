import { render, screen } from "@testing-library/react";
import { CardType } from "../features/cards/card";
import { ComponentProps } from "react";
import CardsListRouteLayout, { clientLoader, shouldRevalidate } from "./cardslist";
import { createRoutesStub, ShouldRevalidateFunctionArgs, useOutletContext } from "react-router";
import { CardList } from "../features/cards/CardList";

jest.mock("../features/cards/CardList", () => ({
  __esModule: true,
  CardList: ({children} : ComponentProps<typeof CardList>) => <div><span>A list of cards</span>{children}</div>
}));

describe("cardslist Route", () => {
  describe("clientLoader", () => {
    beforeEach(async () => {
      fetchMock.resetMocks();
      fetchMock.mockResponse(
        JSON.stringify({ data: 100 })
      );
    });

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

  describe("shouldRevalidate", () => {
    let revalidateArgs : ShouldRevalidateFunctionArgs;
    beforeEach(async () => {
      revalidateArgs = {
        currentUrl: new URL('https://www.placeholder.com'),
        nextUrl: new URL('https://www.placeholder.com'),
        currentParams: {},
        nextParams: {},
        defaultShouldRevalidate: true,
      }
    });

    test("returns false if the URLs are identical", () => {
      revalidateArgs.currentUrl = new URL('https://www.example.com/mytest');
      revalidateArgs.nextUrl = new URL('https://www.example.com/mytest');

      expect(shouldRevalidate(revalidateArgs)).toEqual(false);
    });

    test("returns false if the path are the same, even if queries are different", () => {
      revalidateArgs.currentUrl = new URL('https://www.example.com/mytest?mysearch=neverover');
      revalidateArgs.nextUrl = new URL('https://www.example.com/mytest?param1=thing&param2=stuff');

      expect(shouldRevalidate(revalidateArgs)).toEqual(false);
    });

    describe("if the paths are different", () => {
      beforeEach(() => {
        revalidateArgs.currentUrl = new URL('https://www.example.com/oldandbusted');
        revalidateArgs.nextUrl = new URL('https://www.example.com/mytest');
      })

      test("returns true if the default is true", () => {
        revalidateArgs.defaultShouldRevalidate = true;

        expect(shouldRevalidate(revalidateArgs)).toEqual(true);
      });

      test("returns false if the default is false", () => {
        revalidateArgs.defaultShouldRevalidate = false;
        
        expect(shouldRevalidate(revalidateArgs)).toEqual(false);
      });
    });
  });

  describe("component", () => {
    const loaderData = {
      cards: [{
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
        path: "/cardslist",
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
      render(<Component initialEntries={["/cardslist"]} />);
      return expect(screen.findByText("A list of cards")).resolves.toBeInTheDocument();
    });

    test("passes the loaded cards", async () => {
      render(<Component initialEntries={["/cardslist"]} />);
      return expect(screen.findByText("Cards passed: 2")).resolves.toBeInTheDocument();
    });
  });
});