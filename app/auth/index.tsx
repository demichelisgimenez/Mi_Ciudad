import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AUTH_ROUTES } from "@utils/constants";
import Login from "./screens/login";
import Register from "./screens/register";

export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.REGISTER]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackScreen() {
  return (
    <Stack.Navigator initialRouteName={AUTH_ROUTES.LOGIN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={AUTH_ROUTES.REGISTER} component={Register} />
    </Stack.Navigator>
  );
}
