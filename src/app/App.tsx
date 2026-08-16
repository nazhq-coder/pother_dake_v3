// Pother Dake — intercity ridesharing platform for Bangladesh
// Entry point: mounts the router and delegates all rendering to Layout + child routes

import { RouterProvider } from "react-router";
import { router } from "./routes";

// Root component — keep this thin; actual structure lives in routes.ts
export default function App() {
  return <RouterProvider router={router} />;
}
