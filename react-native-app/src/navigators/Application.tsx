import NoAccess from '@/screens/NoAccess/NoAccess';
import { AuthState } from '@/store/auth';
import { useFlipper } from '@react-navigation/devtools';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { ApplicationStackParamList } from '../../@types/navigation';
import { useTheme } from '../hooks';
import { Login } from '../screens';
import MainNavigator from './Main';

const Stack = createStackNavigator<ApplicationStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {
  const auth = useSelector((state: { auth: AuthState }) => state.auth);
  const { Layout, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);

  useEffect(() => {
    if (auth.user === null) {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else if (auth.user.role !== 'student') {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'NoAccess' }],
      });
    } else {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [auth.user]);

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={'light-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="NoAccess" component={NoAccess} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
