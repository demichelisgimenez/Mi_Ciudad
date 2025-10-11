import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { DRAWER_ROUTES, ROOT_ROUTES, AUTH_ROUTES } from "@utils/constants";
import { useAuth } from "@shared/context/AuthContext";

import InicioScreen from "@app/screens/inicio";
import Farmacias from "@app/screens/farmacias";
import Escuelas from "@app/screens/escuelas";
import Radios from "@app/screens/radios";
import Notas from "@app/screens/notas";
import QR from "@app/screens/qr";
import Ajustes from "@app/screens/ajustes";

const Drawer = createDrawerNavigator();

// --- Footer estado de usuario en el Drawer ---
function UserStatusFooter({ navigation }: { navigation: any }) {
  const { state } = useAuth();
  const loggedIn = !!state?.user;

  const onPress = () => {
    if (loggedIn) {
      // Si ya está logueado, lo llevo a Ajustes (o a su perfil si luego lo agregás)
      navigation.navigate(DRAWER_ROUTES.AJUSTES as never);
    } else {
      // Si NO está logueado, lo llevo al AuthStack -> Login
      navigation.navigate(
        ROOT_ROUTES.AUTH as never,
        { screen: AUTH_ROUTES.LOGIN } as never
      );
    }
  };

  return (
    <View style={{ borderTopWidth: 0.5, borderColor: "#ddd", marginTop: 8 }}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}
      >
        <MaterialIcons
          name={loggedIn ? "account-circle" : "person-outline"}
          size={22}
          color={loggedIn ? "#2e7d32" : "#616161"}
        />
        <Text style={{ fontSize: 15 }}>
          {loggedIn ? "Sesión iniciada" : "Iniciar sesión / Registrarme"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Contenido personalizado del Drawer (lista + footer) ---
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <UserStatusFooter navigation={props.navigation} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator({ route }: any) {
  // Si el Root nos pasa una ruta inicial (p.ej. NOTAS post-login), la usamos; sino INICIO
  const initial = route?.params?.initialRouteName ?? DRAWER_ROUTES.INICIO;

  return (
    <Drawer.Navigator
      initialRouteName={initial}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={DRAWER_ROUTES.INICIO}
        component={InicioScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.FARMACIAS}
        component={Farmacias}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="local-pharmacy" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.ESCUELAS}
        component={Escuelas}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="school" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.RADIOS}
        component={Radios}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="radio" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.NOTAS}
        component={Notas}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="note-alt" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.QR}
        component={QR}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={DRAWER_ROUTES.AJUSTES}
        component={Ajustes}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      {/*
        Importante: NO agregamos LOGIN/REGISTER acá.
        Están en el AuthStack del Root.
      */}
    </Drawer.Navigator>
  );
}
