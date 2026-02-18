import { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import AllCardsRoute from "./allcards";
import { CardType } from "../features/cards/card";
import { Cards } from "../features/cards/Cards";
import { createRoutesStub, useOutletContext as mockUseOutletContext } from "react-router";

jest.mock("../features/cards/Cards", () => ({
  __esModule: true,
  Cards: ({cards} : ComponentProps<typeof Cards>) => cards.map(card => <div key={card.id}>A small card: {card.name}</div>)
}));

jest.mock("react-router", () => ({
  __esModule: true,
  useOutletContext: jest.fn(),
  useNavigation: jest.fn(),
  createRoutesStub: jest.requireActual("react-router").createRoutesStub,
}));

describe("allcards", () => {
  let cards : CardType[];
  let Component : ReturnType<typeof createRoutesStub>;

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
    (mockUseOutletContext as jest.Mock).mockReturnValue(cards);

    Component = createRoutesStub([{
      path: "/allcards",
      Component: AllCardsRoute,
      loader: () => ({cards}),
      HydrateFallback: () => <div />
    }])
  });

  test("renders a list of cards", async () => {
    render(<Component initialEntries={["/allcards"]} />);
    const cards = await screen.findAllByText("A small card", {exact: false});
    expect(cards).toHaveLength(2);
  });
});