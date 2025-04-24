import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PomodoroTimer from './components/PomodoroTimer';
import * as Notifications from 'expo-notifications';

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Pomodoro"
          component={PomodoroTimer}
          options={{ title: 'Pomodoro & To-do' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}