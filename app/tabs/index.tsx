import {Pressable, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {TAB_ROUTES} from "@utils/constants";
import {InicioScreen, MyNetworkScreen, lista_farmacias} from "./screens";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useContext} from "react";
import {AUTH_ACTIONS, AuthContext} from "@shared/context/AuthContext";
import {materialColors} from "@utils/colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";



const Tab = createBottomTabNavigator();

export default function TabsScreen() {

  const {dispatch} = useContext(AuthContext)
  const handleLogout = () => {
    dispatch({type: AUTH_ACTIONS.LOGOUT})
  }

  return (
      <Tab.Navigator screenOptions={{
        headerTitleStyle: {color: materialColors.schemes.light.onPrimaryContainer},
        headerStyle: {backgroundColor: materialColors.schemes.light.surfaceContainer},
        tabBarStyle: {backgroundColor: materialColors.schemes.light.surfaceContainer},
        tabBarActiveTintColor: materialColors.schemes.light.onPrimaryContainer,
        headerRight: ({tintColor, pressColor}) => (
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color={materialColors.schemes.light.onPrimaryContainer}/>
            </TouchableOpacity>
        )
      }}>
        <Tab.Screen name={TAB_ROUTES.INICIO} component={InicioScreen}
                    options={{
                      title: "Inicio",
                      tabBarIcon: ({color, size}) => (
                          <MaterialCommunityIcons name="home" color={color} size={size}/>
                      )
                    }}
        />
        <Tab.Screen name={TAB_ROUTES.ESCUELAS} component={MyNetworkScreen} options={{
          title: "Escuelas",
          tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
          )
        }}/>
              
        <Tab.Screen name={TAB_ROUTES.FARMACIAS} component={lista_farmacias} options={{
          title: "Farmacias",
          tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
          )
        }}/>
      </Tab.Navigator>
  )
}