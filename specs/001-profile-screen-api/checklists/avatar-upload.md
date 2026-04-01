# Deferred Backlog — Avatar Upload

Avatar upload is intentionally disabled for this release. Re-enable only when the following are satisfied:

- Enable feature flag `PROFILE_AVATAR_UPLOAD_ENABLED` (AppEnvConst) with environment-specific toggles.
- Reintroduce image picker (camera/gallery) with JPEG/PNG/WebP support and 5 MB selection guard.
- Add compression pipeline to target ~1 MB before upload; reject HEIC.
- Restore POST /users/1/avatar thunk with multipart/form-data and upload progress handling.
- Refresh profile after successful upload and surface retryable errors via strings/translations.
