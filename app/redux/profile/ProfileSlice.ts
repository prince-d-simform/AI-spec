import { createSlice, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunkWithCancelToken, unauthorizedAPI } from '../../configs';
import { APIConst, Strings, ToolkitAction } from '../../constants';
import { getErrorResponse } from '../../utils/CommonUtils';
import INITIAL_STATE, { type ProfileStateType } from './ProfileInitial';
import { mapProfileResponse } from './ProfileMappers';
import type { RemoteProfileResponse } from '../../types';

const fetchProfileRequest = createAsyncThunkWithCancelToken<RemoteProfileResponse>(
  ToolkitAction.fetchProfile,
  'GET',
  APIConst.userProfile,
  unauthorizedAPI
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: INITIAL_STATE,
  reducers: {
    resetProfileError: (state: Draft<ProfileStateType>) => {
      state.profileError = undefined;
    },
    setProfile: (
      state: Draft<ProfileStateType>,
      action: PayloadAction<ProfileStateType['profile']>
    ) => {
      state.profile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileRequest.pending, (state: Draft<ProfileStateType>) => {
        state.isProfileLoading = true;
        state.profileError = undefined;
      })
      .addCase(fetchProfileRequest.fulfilled, (state: Draft<ProfileStateType>, action) => {
        state.isProfileLoading = false;
        state.profile = mapProfileResponse(action.payload);
        state.profileError = undefined;
      })
      .addCase(fetchProfileRequest.rejected, (state: Draft<ProfileStateType>, action) => {
        state.isProfileLoading = false;
        state.profileError =
          action.payload ?? getErrorResponse(Strings.APIError.somethingWentWrong);
      });
  }
});

export const ProfileReducer = profileSlice.reducer;
export const ProfileActions = {
  ...profileSlice.actions,
  fetchProfileRequest
};

export type ProfileActionsType = typeof ProfileActions;

export default profileSlice;
