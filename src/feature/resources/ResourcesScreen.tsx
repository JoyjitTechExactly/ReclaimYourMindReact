import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, scaleFont } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import { APP_NAVIGATION, HOME } from '../../constants/strings';
import { commonStyles } from '../../styles/commonStyles';
import { ImagePath } from '../../constants/imagePath';
import { ScrollView } from 'react-native-gesture-handler';

const ResourcesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const headerContent = (
    <>
      <Text style={[commonStyles.welcomeText, { color: COLORS.SECONDARY }]}>{HOME.WELCOME_BACK}</Text>
      <Text style={[commonStyles.userName, { color: COLORS.PRIMARY }]}>{HOME.USER_NAME}</Text>
      <Text style={[commonStyles.headerSubtitle, { color: COLORS.TEXT_MUTED }]}>{HOME.HEADER_SUBTITLE}</Text>
    </>
  );

  return (
    <View>
      {/* Fixed Header Section */}
       <View style={[styles.container, { paddingTop: insets.top }]}>
        {headerContent}
      </View>

      {/* Scrollable Content */}
      <ImageBackground
        source={ImagePath.ScreenBackground}
        style={commonStyles.backgroundImage}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.content}>
            
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});

export default ResourcesScreen;
