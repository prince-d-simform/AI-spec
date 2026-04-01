import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { type FC, useCallback, useMemo } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { CustomButton, CustomHeader, FullScreenLoader, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';
import styleSheet from './ProfileStyles';
import { ProfileInfoCard } from './sub-components';
// eslint-disable-next-line import/no-named-as-default
import useProfile from './useProfile';

/**
 *
 * @returns
 */
const ProfileScreen: FC = (): React.ReactElement => {
  const { styles, theme } = useTheme(styleSheet);
  const {
    profile,
    profileView,
    profileError,
    isProfileLoading,
    fetchProfile,
    canEditProfile,
    canUploadAvatar
  } = useProfile();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const hasProfile = useMemo(() => Boolean(profile), [profile]);
  const isViewOnly = useMemo(
    () => !canEditProfile && !canUploadAvatar,
    [canEditProfile, canUploadAvatar]
  );

  if (isProfileLoading && !hasProfile) {
    return (
      <View style={styles.screen}>
        <CustomHeader title={Strings.Profile.screenTitle} />
        <FullScreenLoader />
      </View>
    );
  }

  if (profileError && !hasProfile) {
    return (
      <View style={styles.screen}>
        <CustomHeader title={Strings.Profile.screenTitle} />
        <View style={[styles.section, { marginTop: scale(40) }]}>
          <View style={styles.formCard}>
            <Text variant="headingBold20">{Strings.Profile.errorTitle}</Text>
            <Text style={styles.hint} variant="bodyRegular14">
              {Strings.Profile.errorMessage}
            </Text>
            <Text style={styles.hint} variant="bodyRegular12">
              {Strings.Profile.offlineMessage}
            </Text>
            <CustomButton
              title={Strings.Profile.retryButton}
              style={{ marginTop: scale(12) }}
              onPress={() => fetchProfile()}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <CustomHeader title={Strings.Profile.screenTitle} />
      <ScrollView contentContainerStyle={[styles.scrollContent, styles.section]}>
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            {profileView.avatarUrl ? (
              <Image
                resizeMode="cover"
                source={{ uri: profileView.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons color={Colors[theme]?.gray} name="person" size={scale(42)} />
            )}
          </View>
          <View style={styles.heroText}>
            <Text variant="headingBold20">{profileView.name}</Text>
            <Text style={styles.hint} variant="bodyRegular14">
              {profileView.role}
            </Text>
            {isViewOnly ? (
              <>
                <Text style={styles.hint} variant="bodyRegular12">
                  {Strings.Profile.viewOnlyMessage}
                </Text>
                <Text style={styles.hint} variant="bodyRegular12">
                  {Strings.Profile.viewOnlyTagline}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.infoGrid}>
          <Text variant="headingBold16">{Strings.Profile.fetchSubtitle}</Text>
          <ProfileInfoCard
            iconName="mail"
            label={Strings.Profile.emailLabel}
            value={profileView.email}
            placeholder={Strings.Profile.missingValue}
          />
          <ProfileInfoCard
            iconName="call"
            label={Strings.Profile.phoneLabel}
            value={profileView.phone}
            placeholder={Strings.Profile.phoneFallback}
          />
          <ProfileInfoCard
            iconName="location"
            label={Strings.Profile.locationLabel}
            value={profileView.location}
            placeholder={Strings.Profile.locationFallback}
          />
          <ProfileInfoCard
            iconName="briefcase"
            label={Strings.Profile.roleLabel}
            value={profileView.role}
            placeholder={Strings.Profile.roleFallback}
          />
        </View>

        <View style={styles.divider} />

        <ProfileInfoCard
          iconName="information-circle"
          label={Strings.Profile.bioLabel}
          value={profileView.bio}
          placeholder={Strings.Profile.bioFallback}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
ProfileScreen.displayName = 'ProfileScreen';
