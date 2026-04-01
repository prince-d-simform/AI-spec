export interface RemoteCompany {
  title?: string | null;
}

export interface RemoteAddress {
  city?: string | null;
  country?: string | null;
}

export interface RemoteProfileResponse {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  bio?: string | null;
  company?: RemoteCompany | null;
  address?: RemoteAddress | null;
  message?: string;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string | null;
}

export interface AvatarUploadResponse {
  image: string;
}
