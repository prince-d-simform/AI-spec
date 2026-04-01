# Deferred Backlog — Profile Editing

Feature editing is intentionally disabled for this release. Re-enable only when the following are satisfied:

- Enable feature flag `PROFILE_EDIT_ENABLED` (AppEnvConst) and provide environment toggle per build type.
- Restore Formik form for name/phone/bio with ValidationSchema rules (2–60 chars name, 7–20 digit phone, bio <= 160).
- Reconnect PUT /users/1 via redux thunk; refresh profile on success; surface inline errors on failure.
- Reinstate unsaved-changes guard on navigation with discard/stay actions.
- Add success/error feedback strings and translations before exposing the flow.
