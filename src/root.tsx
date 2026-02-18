import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Modal } from "./features/modal/Modal";
import ModalProvider from "./app/ModalProvider";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Card Binder</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ModalProvider>
          {children}
          <Modal />
        </ModalProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function links() {
  return [
    {
    //   rel: "icon",
    //   type: "image/svg+xml",
    //   href: "/vite.svg",
    // }, {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    }, {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Cormorant+SC:wght@300;400;500;600;700&display=swap",
    },
  ];
}

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <div>Loading...</div>
}