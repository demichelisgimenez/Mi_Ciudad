import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStackScreen from "./auth";
import DrawerNavigator from "./drawer";
import { ROOT_ROUTES } from "@utils/constants";

const Stack = createNativeStackNavigator();

export default function Root() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={ROOT_ROUTES.SCREENS}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROOT_ROUTES.SCREENS} component={DrawerNavigator} />
        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthStackScreen} />
      </Stack.Navigator>
    </View>
  );
}
