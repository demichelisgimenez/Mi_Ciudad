import { createDrawerNavigator } from "@react-navigation/drawer";
import { TAB_ROUTES } from "@utils/constants";

import InicioScreen from "@app/screens/inicio";
import { Farmacias, Escuelas } from "@app/screens";

import Login from "@app/auth/screens/login";             

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName={TAB_ROUTES.INICIO}>

      <Drawer.Screen
        name={TAB_ROUTES.INICIO}
        component={InicioScreen}
        options={{ headerShown: false}}
      />


      <Drawer.Screen name={TAB_ROUTES.FARMACIAS} component={Farmacias} options={{ title: "Farmacias"}}/>
      <Drawer.Screen name={TAB_ROUTES.ESCUELAS} component={Escuelas} options={{ title: "Escuelas" }}/>
      <Drawer.Screen name={TAB_ROUTES.RADIOS}   component={Farmacias}    options={{ title: "Radios" }}/>
      <Drawer.Screen name={TAB_ROUTES.NOTAS}    component={Escuelas}     options={{ title: "Notas" }}/>
      <Drawer.Screen name="Ajustes"              component={Farmacias}   options={{ title: "Ajustes" }}/>
      <Drawer.Screen name={TAB_ROUTES.QR}       component={Escuelas}        options={{ title: "QR" }}/>
      <Drawer.Screen name={TAB_ROUTES.LOGIN}    component={Login}     options={{ title: "Login" }}/>
    </Drawer.Navigator>
  );
}
