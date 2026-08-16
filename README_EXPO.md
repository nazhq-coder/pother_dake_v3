# Pother Dake RDM - React Native (Expo) branch

This branch contains an Expo-based React Native scaffold that mirrors the web app's routes and screens.

Quick start (after clone):

1. Install dependencies

   npm install

2. Start Expo and open Android simulator or device

   npm run android

Notes
- This project uses styled-components for styling and a lightweight axios API client at src/api/client.ts. The client reads the base URL from the Expo "extra" config or EXPO_PUBLIC_API_URL env variable.
- Screens are scaffolded and wired with react-navigation to follow the web app's routes. UI components are minimal placeholders; further conversion of specific UI primitives will be done in follow-up commits.
