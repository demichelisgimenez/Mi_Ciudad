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

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName={DRAWER_ROUTES.INICIO}>
      <Drawer.Screen
        name={DRAWER_ROUTES.INICIO}
        component={InicioScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name={DRAWER_ROUTES.FARMACIAS} component={Farmacias} />
      <Drawer.Screen name={DRAWER_ROUTES.ESCUELAS} component={Escuelas} />
      <Drawer.Screen name={DRAWER_ROUTES.RADIOS} component={Radios} />
      <Drawer.Screen name={DRAWER_ROUTES.NOTAS} component={Notas} />
      <Drawer.Screen name={DRAWER_ROUTES.QR} component={QR} />
      <Drawer.Screen name={DRAWER_ROUTES.AJUSTES} component={Ajustes} />
      <Drawer.Screen
        name={AUTH_ROUTES.LOGIN}
        component={Login}
        options={{ title: "Iniciar Sesión" }}
      />

      <Drawer.Screen
        name={AUTH_ROUTES.REGISTER}
        component={Register}
        options={{ title: "Registrarse", drawerItemStyle: { display: "none" }}}
      />
    </Drawer.Navigator>
  );
}
