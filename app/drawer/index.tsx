import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { DRAWER_ROUTES, ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";
import { useAuth } from "@shared/context/AuthContext";
import { colors } from "@utils";
import { drawerStyles as ds } from "@utils/styles/drawer";

import InicioScreen from "@app/screens/inicio";
import Farmacias from "@app/screens/farmacias";
import Escuelas from "@app/screens/escuelas";
import Radios from "@app/screens/radios";
import Notas from "@app/screens/notas";
import QR from "@app/screens/qr";
import Ajustes from "@app/screens/ajustes";
import SobreMiCiudadScreen from "@app/screens/sobreMiCiudad";

const Drawer = createDrawerNavigator();

function SessionFooter({ navigation }: { navigation: any }) {
  const { state } = useAuth();
  const loggedIn = !!state?.user;

  const onPress = () => {
    if (loggedIn) {
      navigation.navigate(DRAWER_ROUTES.AJUSTES as never);
    } else {
      navigation.navigate(ROOT_ROUTES.AUTH as never, { screen: AUTH_ROUTES.LOGIN } as never);
    }
  };

  return (
    <View style={ds.footerContainer}>
      <TouchableOpacity onPress={onPress} style={ds.footerButton}>
        <MaterialIcons
          name={loggedIn ? "account-circle" : "person-outline"}
          size={22}
          style={loggedIn ? ds.footerIconActive : ds.footerIconInactive}
        />
        <Text style={ds.footerText}>
          {loggedIn ? "Sesión iniciada" : "Iniciar sesión / Registrarme"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AppCreditsFooter() {
  return (
    <View style={ds.footerMetaContainer}>
      <Image
        source={require("../../assets/icon.png")}
        style={ds.footerLogo}
        resizeMode="contain"
      />
      <Text style={ds.footerAppName}>© 2025 · Mi Ciudad</Text>
      <Text style={ds.footerDevelopers}>
        Desarrollado por Agustín Demichelis y Enzo Daniel Gimenez Silva
      </Text>
    </View>
  );
}

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        <DrawerItemList {...props} />
        <SessionFooter navigation={props.navigation} />
      </View>

      <AppCreditsFooter />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator({ route }: any) {
  const initial = route?.params?.initialRouteName ?? DRAWER_ROUTES.INICIO;

  return (
    <Drawer.Navigator
      initialRouteName={initial}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: "transparent",
        headerTintColor: colors.textPrimary,
      }}
    >
      <Drawer.Screen
        name={DRAWER_ROUTES.INICIO}
        component={InicioScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.FARMACIAS}
        component={Farmacias}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="local-pharmacy" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.ESCUELAS}
        component={Escuelas}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="school" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.RADIOS}
        component={Radios}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="radio" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.NOTAS}
        component={Notas}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="note-alt" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.QR}
        component={QR}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="qr-code-scanner" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.SOBRE_MI_CIUDAD}
        component={SobreMiCiudadScreen}
        options={{
          title: "Sobre Mi Ciudad",
          drawerIcon: ({ color, size }) => <MaterialIcons name="info" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.AJUSTES}
        component={Ajustes}
        options={{
          drawerIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
