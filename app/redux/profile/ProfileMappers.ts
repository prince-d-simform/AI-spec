import type { UserProfile } from '../../modules/profile/ProfileTypes';
import type { RemoteProfileResponse } from '../../types';

/**
 * Maps a remote profile response to the local view model.
 * @param {RemoteProfileResponse | undefined} record - API record.
 * @returns {UserProfile | undefined} normalized profile.
 */
export function mapProfileResponse(record?: RemoteProfileResponse): UserProfile | undefined {
  if (!record || !record.id || !record.firstName || !record.lastName || !record.email) {
    return undefined;
  }

  const fullName = [record.firstName, record.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');

  return {
    id: String(record.id),
    firstName: record.firstName?.trim() ?? '',
    lastName: record.lastName?.trim() ?? '',
    fullName: fullName || `${record.firstName} ${record.lastName}`.trim(),
    email: record.email?.trim() ?? '',
    phone: record.phone?.trim() ?? '',
    bio: record.bio ?? null,
    avatarUrl: record.image?.trim() ?? null,
    city: record.address?.city?.trim() ?? null,
    country: record.address?.country?.trim() ?? null,
    role: record.company?.title?.trim() ?? null
  };
}
