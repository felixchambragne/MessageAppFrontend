import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {AuthProvider} from './contexts/auth';
import HomeScreen from './screens/Home';
import {COLORS} from './constants/colors';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
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
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
