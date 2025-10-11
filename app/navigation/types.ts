import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AuthStackParamList } from "@app/auth";
import { ROOT_ROUTES } from "@utils/constants";

export type RootStackParamList = {
  [ROOT_ROUTES.SCREENS]: undefined;
  [ROOT_ROUTES.AUTH]: NavigatorScreenParams<AuthStackParamList>;
};
