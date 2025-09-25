import { createDrawerNavigator } from "@react-navigation/drawer";
import { DRAWER_ROUTES, AUTH_ROUTES } from "@utils/constants";

import InicioScreen from "@app/screens/inicio";
import Farmacias from "@app/screens/farmacias";
import Escuelas from "@app/screens/escuelas";
import Radios from "@app/screens/radios";
import Notas from "@app/screens/notas";
import QR from "@app/screens/qr";
import Ajustes from "@app/screens/ajustes";
import Login from "@app/auth/screens/login";
import { Register } from "@app/auth/screens";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName={DRAWER_ROUTES.INICIO}>
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
      <Drawer.Screen
        name={AUTH_ROUTES.LOGIN}
        component={Login}
        options={{
          title: "Iniciar Sesión",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="login" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={AUTH_ROUTES.REGISTER}
        component={Register}
        options={{
          title: "Registrarse",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person-add" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
