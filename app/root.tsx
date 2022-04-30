import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "remix";
import type { MetaFunction } from "remix";

import tailwind from "./tailwind.css";

export function links() {
  return [{ rel: "stylesheet", href: tailwind }];
}

export const meta: MetaFunction = () => {
  return { title: "HWAP" };
};

export default function App() {
  const location = useLocation();
  return (
    <html
      data-theme={location.pathname.includes("admin") ? "cupcake" : "light"}
      lang="en"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
