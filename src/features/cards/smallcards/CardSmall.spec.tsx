import { render, screen } from "@testing-library/react";
import { CardSmall } from "./CardSmall";
import type { CardType } from "../card";
import { ComponentProps } from "react";
import { CardTitle } from "../title/CardTitle";
import { CardRarity } from "../rarity/CardRarity";
import { useSearchParams } from "react-router";

jest.mock("../title/CardTitle", () => ({
  __esModule: true,
  CardTitle: ({name} : ComponentProps<typeof CardTitle>) => <h1>{name}</h1>
}));

jest.mock("../rarity/CardRarity", () => ({
  __esModule: true,
  CardRarity: ({rarity} : ComponentProps<typeof CardRarity>) => <h1>Test Rarity: {rarity}</h1>
}));

jest.mock('react-router', () => ({
  __esModule: true,
  Link: jest.fn(({children}) => children),
  useSearchParams: jest.fn()
}));

describe("CardSmall", () => {
  let card: CardType;
  beforeEach(async () => {
    card = {
        id: 100,
        name: "Test Title",
        description: "",
        image: "",
        rarity: 3,
        quantity: 1,
    };
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams({"things":"stuff"}), jest.fn()])
  });

  test("renders name", async () => {
    render(<CardSmall card={card} />);
    expect(screen.getByRole("heading", { name: "Test Title" })).toBeInTheDocument();
  });

  test("renders rarity", async () => {
    render(<CardSmall card={card} />);
    expect(screen.getByRole("heading", { name: "Test Rarity: 3" })).toBeInTheDocument();
  });
});