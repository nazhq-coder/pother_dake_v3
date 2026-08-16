# Pother Dake RDM — Mobile (Expo)

This README documents the current state of the mobile frontend on the react-native-android branch. It describes what is implemented, how to run the app, how the API integration works, and developer notes (mock vs real mode, toggles, and important assumptions).

> Branch: react-native-android — this README is committed to that branch and reflects the code on that branch.

---

## Quick summary

- Framework: Expo (React Native) + TypeScript
- Styling: styled-components
- Navigation: React Navigation (native stack)
- HTTP client: axios
- Token storage: Expo SecureStore
- API: mock-first service layer with optional real API integration; configured for your RideShare API (http://72.61.225.177:5001) by default on this branch
- Role-based UI: Driver / Passenger / Admin guards and sidebar filtering are implemented

---

## Branches and purpose

- main
  - Primary repository README and other repository-wide docs. May not contain the full mobile scaffold.
- react-native-android (this branch)
  - Active mobile frontend development branch. All mobile feature work and experiments live here (UI, API wiring, mock-data support, registration, create-trip, booking flows, role guards).

If you intend to merge mobile work to `main`, open a PR from `react-native-android` to `main` after you verify behavior.

---

## Current implemented features (status)

Completed and available on react-native-android:
- App scaffolding (Expo + TypeScript)
- Header + Sidebar layout primitives
- Screens: Landing, Search, TripDetails, Auth, PassengerDashboard, DriverDashboard, AdminDashboard
- UI primitives: Card, StatCard, ChartPlaceholder
- Passenger/Driver dashboards (mock-driven content)
- Create Trip form (driver) — posts to `/tripRoute/create`
- Trip booking flow (TripDetails → POST `/tripBookedRoute/tripBooked`)
- Complete-registration form (multipart/form-data) — posts to `/user/complete-registration`
- Auth flow wired to `/auth/login` with token persistence via SecureStore
- API client with axios + robust token handling + mock fallback
- Role-based UI and route guards (driver/passenger/admin only access their areas)
- A small CLI test helper to inspect `/auth/login` responses: `scripts/test-login.js`
- README (this file) committed on `react-native-android`

Notes:
- Charts and Maps remain placeholders — replace with `react-native-maps` and a charting library for production (recommended: `victory-native` or `react-native-chart-kit`).

---

## How to run (developer steps)

1. Clone and checkout the branch:

   git clone https://github.com/ShahriyarSumon/pother_dake-RDM-_v1.0.git
   cd pother_dake-RDM-_v1.0
   git checkout react-native-android

2. Install dependencies:

   npm install

   Install native/expo dependencies (recommended):

   npx expo install expo-secure-store expo-document-picker react-native-reanimated react-native-gesture-handler

3. Start the app:

   npm run start
   # open on Android emulator/device
   npm run android

4. Quick test: The Auth screen is pre-filled for convenience on the branch (development/test account fields), but you should not commit production credentials. Use the `scripts/test-login.js` helper to inspect live login responses before using real credentials.

---

## API configuration

- Default API host (on this branch) is set in `app.json`:

  - `app.json.extra.apiUrl` — default: `http://72.61.225.177:5001`
  - `app.json.extra.useMock` — default on this branch: `false` (real-first with mock fallback)

- Override at runtime with an environment variable:

  - `EXPO_PUBLIC_API_URL` — sets the base URL for axios
  - `USE_MOCK=true` (or `app.json.extra.useMock = true`) — forces mock-mode

- Service endpoints implemented in `src/api/index.ts` (with mock fallbacks where appropriate):
  - POST /auth/login → login(email, password)
  - GET /tripRoute → fetchTrips() (primary)
  - GET /tripRoute/my-trips → fallback / user-specific
  - GET /tripRoute/:id → fetchTripById(id)
  - POST /tripRoute/create → createTrip(payload)
  - DELETE /tripRoute/:id → deleteTrip(id)
  - POST /tripBookedRoute/tripBooked → bookTrip(payload)
  - GET /tripBookedRoute → getAllBookings()
  - GET /user/drivers → getAllDrivers()
  - GET /user/passengers → getAllPassengers()
  - POST /user/complete-registration → completeRegistration(formData)

Important assumptions:
- For createTrip and bookTrip, the client currently relies on the backend to infer the actor (driver/passenger) from the authenticated token. If your API requires explicit `driverId` or `passengerId` in the JSON body, update the client or tell me and I will change the payloads.
- Complete registration uses FormData with keys: `email`, `otpCode`, `gender`, `nidNo`, `profession`, `nidFront` (file), `nidBack` (file). Match these to your backend expected field names.

---

## Auth, token and user persistence

- Token storage: Expo SecureStore key `AUTH_TOKEN_V1` (value is the raw bearer token string).
- User persistence: stored under `AUTH_USER_V1` (JSON string) to support role-based UI.
- On app startup the stored token (if any) is loaded into axios defaults so subsequent requests include Authorization: Bearer <token>.
- The client attempts to extract the token from common fields returned by `/auth/login`: `token`, `accessToken`, or `data.token` (and stores the `user` object if present). If your login response uses a different schema, run `scripts/test-login.js` and paste the JSON here or provide an example, and I will update the client parser.

---

## Role-based UI and route guards

- The app expects a `user.role` field with values such as `DRIVER`, `PASSENGER`, or `ADMIN` (case-insensitive).
- Sidebar and navigation are filtered based on the authenticated user's role.
- `RoleGuard` component prevents unauthorized navigation and redirects the user to their appropriate dashboard with an alert.

Security note: RoleGuard is client-side UX protection. Ensure your server enforces role-based authorization for every protected endpoint.

---

## Files of interest

- `src/api/client.ts` — axios client and SecureStore helpers (set/get/clear token and user)
- `src/api/index.ts` — service layer functions
- `src/auth/AuthContext.tsx` — global auth provider (user state + helpers)
- `src/components/RoleGuard.tsx` — route guard HOC
- `src/components/Sidebar.tsx` — role-aware sidebar links
- `src/screens/*` — screens implementations (CreateTrip, CompleteRegistration, TripDetails booking flow, dashboards)
- `scripts/test-login.js` — CLI helper to POST `/auth/login` and show the raw response

---

## Developer notes & troubleshooting

- Mock vs Real:
  - `app.json.extra.useMock` toggles mock behavior on the device. When `true`, API calls return local mock data when configured. When `false`, the client calls the real API first and falls back to mock on network errors.
  - To switch quickly without editing files, set environment variables when starting Metro/Expo: `USE_MOCK=true` or `EXPO_PUBLIC_API_URL=http://yourhost`.

- Document / file uploads:
  - `CompleteRegistration` uses `expo-document-picker` to choose files and sends them via FormData. On Android simulators, picking files may require allowing permissions or using a real device.

- Token & errors:
  - If API returns 401/403, the app currently shows an alert and you can implement auto-logout or token-refresh behavior. If you have a refresh token endpoint, I can implement token refresh and retry logic.

- Testing login response:
  - Run `node scripts/test-login.js --email=... --password='...'` to see the raw JSON. If the token is returned under a non-standard key, paste the JSON here and I will update token extraction.

---

## TODO / backlog (recommended next work)

- Replace ChartPlaceholder/Map placeholder with `react-native-maps` and a charting library (victory-native or react-native-chart-kit)
- Improve error handling (401 auto-logout, retry, user-friendly messages)
- Add unit/integration tests for RoleGuard and API service
- Improve validations and UX in CreateTrip and CompleteRegistration flows
- Add in-app developer toggle for mock-mode (so QA can switch without editing app.json)
- Add CI workflow for Expo builds (EAS) if you need production builds

---

## Contributing & testing

- Develop on feature branches and open PRs to `react-native-android`. When stable, open a PR from `react-native-android` → `main`.
- Do not commit real credentials to the repo. Use `scripts/test-login.js` and environment variables for verification.

---

If you want any text changes, additional examples (sample API responses), screenshots, or a developer checklist I can include, tell me and I will update the README and commit again to the `react-native-android` branch.# pother-dake-mobile
# pother-dake-app
