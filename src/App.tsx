import messaging from '@react-native-firebase/messaging';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {SafeAreaView, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {COLORS} from './constants/colors';
import {AppProvider} from './contexts/AppContext';
import {AuthProvider} from './contexts/AuthContext';
import i18n from './lib/i18n';
import AboutScreen from './screens/About';
import HomeScreen from './screens/Home';
import './utils/polyfills';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <AuthProvider>
          <SafeAreaView style={styles.full}>
            <GestureHandlerRootView style={styles.full}>
              <NavigationContainer
                theme={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    background: COLORS.background,
                    primary: COLORS.primary,
                    text: COLORS.foreground,
                  },
                }}>
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerShown: false,
                  }}>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen
                    name="About"
                    component={AboutScreen}
                    options={{
                      animation: 'fade_from_bottom',
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </GestureHandlerRootView>
          </SafeAreaView>
        </AuthProvider>
      </AppProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
