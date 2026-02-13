import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import * as supabase from "@supabase/supabase-js";
import MyCardsRoute, { clientLoader, MyCardsLoaderProps } from "./mycards";
import { useOutletContext, useSearchParams } from "react-router";
import { Cards } from "../features/cards/Cards";

var mockClient : {
  functions: {
    invoke() : void,
  }
  channel() : () => {}
  removeChannel() : void,
};
var mockInvoke : jest.Mock;
var mockChannel : jest.Mock;
var mockRemoveChannel : jest.Mock;
jest.mock("@supabase/supabase-js", () => ({
  __esModule: true,
  createClient: jest.fn(() => {
    mockInvoke = jest.fn();
    mockChannel = jest.fn();
    mockRemoveChannel = jest.fn();
    mockClient = {
      functions: {
        invoke: mockInvoke
      },
      channel: mockChannel,
      removeChannel: mockRemoveChannel
    };
    return mockClient;
  })
}));

jest.mock("react-router", () => ({
  __esModule: true,
  useOutletContext: jest.fn(),
  useSearchParams: jest.fn()
}));

jest.mock("../features/cards/Cards", () => ({
  __esModule: true,
  Cards: ({cards} : ComponentProps<typeof Cards>) => cards.map(card => <div>A small card: {card.name}</div>)
}));

jest.mock("../app/auth.client", () => (jest.fn(() => ({userId: 1234}))));

describe("mycards Route", () => {
  let loaderData : MyCardsLoaderProps;
  let defaultProps : ComponentProps<typeof MyCardsRoute>;

  beforeEach(async () => {
    loaderData = {
      userId: "tony",
      inventory: {
        i: 1,
        v: 5,
        x: 10,
        c: 100,
        d: 50,
      }
    };
    defaultProps = {
        loaderData: loaderData,
        params: {},
        matches: [{
            id: "root",
            params: {},
            pathname: "",
            data: undefined,
            loaderData: undefined,
            handle: undefined
        }, {
            id: "pages/cardslist",
            params: {},
            pathname: "",
            data: {
              cards: []
            },
            loaderData: {
              cards: []
            },
            handle: undefined
        }, {
            id: "pages/mycards",
            params: {},
            pathname: "",
            data: loaderData,
            loaderData: loaderData,
            handle: undefined
        }]
    };
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams({"things":"stuff"}), jest.fn()])

    mockInvoke.mockClear();
    mockInvoke.mockResolvedValue(
      { data: { status: "ok", inventory: {c: 100} } }
    );
  });

  describe("clientLoader", () => {
    test("fetches data from supabase", async () => {
      await clientLoader();
      expect(process.env.SUPABASE_URL).not.toEqual(""); // Sanity check
      expect(process.env.SUPABASE_ANON_KEY).not.toEqual(""); // Sanity check
      expect(supabase.createClient).toHaveBeenCalledWith(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    })

    test("invokes getInventory from supabase", async () => {
      await clientLoader();
      expect(mockInvoke).toHaveBeenCalledWith("getInventory", {body: { userId: 1234 }});
    })

    test("returns data from supabase", async () => {
      return expect(clientLoader()).resolves.toEqual({ userId: 1234, inventory: { c: 100 } });
    })
  });

  describe("Component", () => {
    beforeEach(() => {
      const cards = [{
        id: 100,
        name: "Test Title",
        description: "",
        image: "",
        rarity: 3,
        quantity: 1,
      },{
        id: 101,
        name: "Test Card 2",
        description: "",
        image: "",
        rarity: 5,
        quantity: 10,
      }];
      (useOutletContext as jest.Mock).mockReturnValue(cards);

      mockChannel.mockClear()
      mockChannel.mockReturnValue({ on: mockChannel, subscribe: mockChannel });
    })

    test("renders a list of cards", async () => {
      render(<MyCardsRoute {...defaultProps} loaderData={loaderData} />);
      return expect(screen.findAllByText("A small card", {exact: false})).resolves.toHaveLength(2);
    });
  })
});