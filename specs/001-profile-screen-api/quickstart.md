# Quickstart — Profile Screen UI and API

1. Checkout branch `001-profile-screen-api`.
2. Install deps if needed: `yarn install`.
3. Run app: `yarn ios:dev` or `yarn android:dev`.
4. Feature entry: navigate to Profile screen (route: ROUTES.PROFILE) from the navigation menu.
5. Expected flows (read-only):
   - Load profile from GET /users/1 with loader, error, and retry states.
   - Display avatar, full name, email, phone, role/title, city + country using placeholders when partial.
   - Show view-only messaging; no edit or avatar upload controls are available.
6. Strings: profile namespace must cover loading/error/retry, missing-field placeholders, and view-only messaging in translations/en.json and Strings.Profile.
7. Theming: use `useTheme`, `ApplicationStyles`, `Colors`, and `scale` for all styles; no hardcoded colors/strings.
8. Redux: implement fetch-only slice/thunk under app/redux/profile; no fetch logic inside components.
9. Tests: run `yarn local-check` before PR.
