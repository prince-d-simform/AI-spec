# Research Findings — Profile Screen UI and API

## Decision 1: Displayed fields (essential only)

- **Decision**: Show avatar, full name (first + last), email (read-only), phone, location (city, country), role/title (from company.title), and optional bio. Exclude sensitive/system fields (username, password, bank, ssn/ein, IP/MAC, crypto, userAgent, bloodGroup, height/weight, hair/eye, coordinates).
- **Rationale**: Meets “only genuine and most required details” while respecting privacy and avoiding clutter from non-essential data.
- **Alternatives considered**: (a) Full dataset surface (too noisy, exposes sensitive info); (b) Minimal contact-only (avatar, name, email) — rejected to keep phone + role for practical use.

## Decision 2: Avatar change flow (client-side guardrails)

- **Decision**: Support camera or gallery; accept JPEG/PNG/WebP; reject HEIC by default; enforce 5 MB max selected size; compress to ~1 MB target before upload; surface progress + retry on failure.
- **Rationale**: Balances user flexibility with predictable upload success and bandwidth control; aligns with prior recommendation and mobile best practices.
- **Alternatives considered**: (a) Gallery-only, no compression (simpler UX but higher failure/bandwidth risk); (b) No client limits, rely on server validation (risk of large/heic failures and wasted uploads).

## Decision 3: Profile validation rules

- **Decision**: Name required (trimmed, 2–60 chars), phone required (digits plus +() - spaces, length 7–20 after stripping non-digits), bio optional max 160 chars; email view-only. Block save on invalid fields and show inline errors.
- **Rationale**: Prevents bad data while keeping edits lightweight; matches mobile-friendly patterns and existing validation utilities.
- **Alternatives considered**: (a) Looser validation (allows garbage data); (b) Stricter locale-specific phone validation (adds complexity without requirement).

## Decision 4: API interactions

- **Decision**: Fetch profile via GET `/users/1`; update editable fields via PUT `/users/1` (firstName, lastName, phone, bio); upload avatar via POST `/users/1/avatar` with multipart/form-data (client compression first). Refresh profile after successful update/upload.
- **Rationale**: Keeps endpoints aligned with provided dataset and supports end-to-end view/edit flows with a single user resource.
- **Alternatives considered**: (a) PATCH partial updates (similar but PUT is simpler given small payload); (b) Separate `/users/me` (not provided in dataset).
