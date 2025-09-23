import AuthStackScreen from "./auth";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ROOT_ROUTES} from "@utils/constants";
import {useContext, useEffect, useState} from "react";
import {AUTH_ACTIONS, AuthContext} from "@shared/context/AuthContext";
import {getUser} from "@utils/secure-store";
import * as SplashScreen from 'expo-splash-screen';
import {View} from "react-native";
import DrawerNavigator from "./drawer";


const Stack = createNativeStackNavigator()

export default function Root() {
  const {state, dispatch} = useContext(AuthContext)

  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)

  useEffect(() => {
    if (state?.user) {
      setIsSignedIn(true)
    } else {
      setIsSignedIn(false)
    }
  }, [state]);


  useEffect(() => {
    getUser().then(user => {
      if (user) {
        dispatch({type: AUTH_ACTIONS.SET_USER, payload: {user}})
        setIsSignedIn(true)
      }
      SplashScreen.hideAsync();
    })
  }, []);
  return (
      <View style={{flex: 1}}>
        <Stack.Navigator
            initialRouteName={isSignedIn ? ROOT_ROUTES.SCREENS : ROOT_ROUTES.AUTH} screenOptions={{headerShown: false}}>
          {
            isSignedIn ?
                <Stack.Screen name={ROOT_ROUTES.SCREENS} component={DrawerNavigator}/>
                :
                <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthStackScreen}/>
          }
        </Stack.Navigator>
      </View>
  )
}