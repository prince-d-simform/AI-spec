# Contract — Profile API Consumption

## GET /users/1

- **Purpose**: Fetch current user profile.
- **Response (subset used)**:
  - id: number
  - firstName: string
  - lastName: string
  - email: string
  - phone: string
  - image: string | null (avatar)
  - company.title: string | null (role)
  - address.city: string | null
  - address.country: string | null
  - bio: string | null (if provided; else client stores locally until saved)
- **Notes**: Ignore sensitive fields (password, bank, ssn, ip, crypto, userAgent, coordinates).

## PUT /users/1

- **Purpose**: Update profile fields.
- **Request body**:
  - firstName: string
  - lastName: string
  - phone: string
  - bio?: string | null
- **Response**: Updated user profile object (same shape as GET).

## POST /users/1/avatar

- **Purpose**: Upload new avatar image.
- **Request**: multipart/form-data
  - file: binary (JPEG/PNG/WebP), <= ~1 MB after client compression (5 MB max selected)
- **Response**: { image: string } (new avatar URL); client refetches profile.

## Error Handling

- 401/403: Treat as auth expiry; prompt re-auth.
- 4xx validation: Surface message from server or fallback friendly error.
- 5xx/network: Show retry affordance; keep last known profile cached in state until success.
