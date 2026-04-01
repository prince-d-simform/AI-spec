import type { ProfileStateType } from './ProfileInitial';
import type { UserProfile } from '../../modules/profile/ProfileTypes';
import type { ErrorResponse } from '../../types';
import type { RootStateType } from '../Store';

interface ProfileSelectorsType {
  getProfileState: (state: RootStateType) => ProfileStateType;
  getProfile: (state: RootStateType) => UserProfile | undefined;
  getProfileLoading: (state: RootStateType) => boolean;
  getProfileError: (state: RootStateType) => ErrorResponse | undefined;
}

/**
 *
 * @param state
 * @returns
 */
const getProfileState = (state: RootStateType): ProfileStateType =>
  (state as RootStateType & { profile: ProfileStateType }).profile;

const ProfileSelectors: ProfileSelectorsType = {
  getProfileState,
  getProfile: (state: RootStateType): UserProfile | undefined => getProfileState(state).profile,
  getProfileLoading: (state: RootStateType): boolean => getProfileState(state).isProfileLoading,
  getProfileError: (state: RootStateType): ErrorResponse | undefined =>
    getProfileState(state).profileError
};

export default ProfileSelectors;
