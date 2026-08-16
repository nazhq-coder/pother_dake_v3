// Centralised route config — all app routes are defined here in one place.
// Using React Router v7 Data Mode with createBrowserRouter.

import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import SearchResults from "./components/SearchResults";
import TripDetails from "./components/TripDetails";
import AuthPage from "./components/AuthPage";
import PassengerDashboard from "./components/PassengerDashboard";
import DriverDashboard from "./components/DriverDashboard";
import AdminDashboard from "./components/AdminDashboard";

/* Single root layout wraps every route — navbar and sidebar live there.
   Wildcard paths (driver/*, admin/*) let sub-tabs manage their own URL segments
   without needing separate route entries for each tab. */
export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "search", Component: SearchResults },
      { path: "trip/:id", Component: TripDetails },
      { path: "auth", Component: AuthPage },
      // Passenger area — tab-based UI handles sub-pages internally
      { path: "passenger", Component: PassengerDashboard },
      { path: "passenger/*", Component: PassengerDashboard },
      // Driver area — includes embedded post-trip form
      { path: "driver", Component: DriverDashboard },
      { path: "driver/*", Component: DriverDashboard },
      // Admin — full management panel with recharts analytics
      { path: "admin", Component: AdminDashboard },
      { path: "admin/*", Component: AdminDashboard },
    ],
  },
]);
