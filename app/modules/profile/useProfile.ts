import { useCallback, useMemo } from 'react';
import { AppEnvConst, Strings } from '../../constants';
import { ProfileActions, ProfileSelectors } from '../../redux/profile';
import { useAppDispatch, useAppSelector } from '../../redux/useRedux';

const PROFILE_ID = 1;

/**
 *
 * @returns
 */
export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(ProfileSelectors.getProfile);
  const isProfileLoading = useAppSelector(ProfileSelectors.getProfileLoading);
  const profileError = useAppSelector(ProfileSelectors.getProfileError);

  const canEditProfile = AppEnvConst.profileEditEnabled;
  const canUploadAvatar = AppEnvConst.profileAvatarUploadEnabled;

  const fetchProfile = useCallback(() => {
    dispatch(ProfileActions.resetProfileError());
    return dispatch(ProfileActions.fetchProfileRequest({ paths: { id: PROFILE_ID } }));
  }, [dispatch]);

  const heroRole = useMemo(() => profile?.role || Strings.Profile.roleFallback, [profile]);

  const heroLocation = useMemo(() => {
    if (!profile) {
      return Strings.Profile.locationFallback;
    }

    const city = profile.city?.trim();
    const country = profile.country?.trim();

    if (city && country) {
      return `${city}, ${country}`;
    }

    return city || country || Strings.Profile.locationFallback;
  }, [profile]);

  const profileView = useMemo(
    () => ({
      name: profile?.fullName || Strings.Profile.nameFallback,
      email: profile?.email || Strings.Profile.missingValue,
      phone: profile?.phone || Strings.Profile.phoneFallback,
      role: heroRole,
      location: heroLocation,
      bio: profile?.bio || Strings.Profile.bioFallback,
      avatarUrl: profile?.avatarUrl
    }),
    [heroLocation, heroRole, profile]
  );

  return {
    profile,
    profileView,
    isProfileLoading,
    profileError,
    fetchProfile,
    canEditProfile,
    canUploadAvatar
  };
};

export default useProfile;
