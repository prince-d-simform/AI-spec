import type { UserProfile } from '../../modules/profile/ProfileTypes';
import type { ErrorResponse } from '../../types';

export interface ProfileStateType {
  profile?: UserProfile;
  isProfileLoading: boolean;
  profileError?: ErrorResponse;
}

const INITIAL_STATE: ProfileStateType = {
  profile: undefined,
  isProfileLoading: false,
  profileError: undefined
};

export default INITIAL_STATE;
