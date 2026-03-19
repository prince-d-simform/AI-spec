# Data Model — Profile Screen

## Entities

### UserProfile (view model)

- id: number
- firstName: string
- lastName: string
- fullName: string (derived)
- email: string (read-only)
- phone: string
- bio: string | null
- avatarUrl: string | null
- location: { city: string; country: string }
- role: string | null (from company.title)

### ProfileUpdateRequest

- firstName: string
- lastName: string
- phone: string
- bio?: string | null

### AvatarUpload

- fileUri: string
- mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
- sizeBytes: number (must be <= 5_000_000 pre-upload, compressed to ~1_000_000)

### Validation Rules

- name: required, trimmed, 2–60 chars
- phone: required, digits plus +() - spaces allowed; 7–20 digits after stripping formatting
- bio: optional, max 160 chars
- avatar: allowed mime types JPEG/PNG/WebP; size <= 5 MB selected, compressed before upload

### Relationships

- UserProfile is fetched from GET /users/1
- ProfileUpdateRequest is sent via PUT /users/1
- AvatarUpload is sent via POST /users/1/avatar
