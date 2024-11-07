import React from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.button_color,
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.bg_color,
        borderTopWidth: 0
      },
    }}
    sceneContainerStyle={{
      marginBottom: -1
    }}>
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({color}) => <Icon name={"home"} size={24} color={color}/>,
          tabBarLabel: "Главная",
          tabBarLabelStyle: {
            fontFamily: "MontserratRegular",
            fontSize: 8
          }
        }}
      />

      <Tabs.Screen
        name="tags"
        options={{
          tabBarIcon: ({color}) => <Icon name={"tags"} size={24} color={color}/>,
          tabBarLabel: "Категории",
          tabBarLabelStyle: {
            fontFamily: "MontserratRegular",
            fontSize: 8
          }
        }}
      />

      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({color}) => <Icon name={"like"} size={24} color={color}/>,
          tabBarLabel: "Избранное",
          tabBarLabelStyle: {
            fontFamily: "MontserratRegular",
            fontSize: 8
          }
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({color}) => <Icon name={"user"} size={24} color={color}/>,
          tabBarLabel: "Профиль",
          tabBarLabelStyle: {
            fontFamily: "MontserratRegular",
            fontSize: 8
          }
        }}
      />
    </Tabs>
  );
}
