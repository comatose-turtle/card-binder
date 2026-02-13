import {
  type RouteConfig,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./pages/cardslist.tsx", [
    route("/allcards", "./pages/allcards.tsx"),
    route("/mycards", "./pages/mycards.tsx"),
  ]),
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
