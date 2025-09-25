import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AUTH_ROUTES } from "@utils/constants";
import { Login, Register } from "./screens";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={AUTH_ROUTES.REGISTER} component={Register} />
    </Stack.Navigator>
  );
}
