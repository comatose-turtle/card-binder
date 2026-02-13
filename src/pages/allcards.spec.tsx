import { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import AllCardsRoute from "./allcards";
import { CardType } from "../features/cards/card";
import { Cards } from "../features/cards/Cards";
import { useOutletContext } from "react-router";

jest.mock("../features/cards/Cards", () => ({
  __esModule: true,
  Cards: ({cards} : ComponentProps<typeof Cards>) => cards.map(card => <div>A small card: {card.name}</div>)
}));

jest.mock("react-router", () => ({
  __esModule: true,
  useOutletContext: jest.fn()
}));

describe("allcards", () => {
  let cards : CardType[];
  let defaultProps : ComponentProps<typeof AllCardsRoute>;

  beforeEach(async () => {
    cards = [{
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
    defaultProps = {
      loaderData: {cards},
      params: {},
      matches: [{
        id: "root",
        params: {},
        pathname: "",
        data: undefined,
        loaderData: undefined,
        handle: undefined
      }, {
        id: "pages/allcards",
        params: {},
        pathname: "",
        data: {cards},
        loaderData: {cards},
        handle: undefined
      }]
    };

    (useOutletContext as jest.Mock).mockReturnValue(cards);
  });

  test("renders a list of cards", async () => {
    render(<AllCardsRoute {...defaultProps} />);
    const cards = await screen.findAllByText("A small card", {exact: false});
    expect(cards).toHaveLength(2);
  });
});