import React from 'react';
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import {useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
import {Theme} from "@/shared/providers/Theme";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.button_color,
      headerShown: false,
      tabBarShowLabel: false,
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
        options={{ tabBarIcon: ({color}) => <MaterialCommunityIcons name="cards" size={24} color={ color } /> }}
      />

      <Tabs.Screen
        name="tags"
        options={ {tabBarIcon: ({color}) => <AntDesign name="tags" size={24} color={ color } />}}
      />

      <Tabs.Screen
        name="likes"
        options={{ tabBarIcon: ({color}) => <AntDesign name="heart" size={24} color={ color } /> }}
      />

      <Tabs.Screen
        name="about"
        options={{ tabBarIcon: ({color}) => <AntDesign name="infocirlce" size={24} color={ color } /> }}
      />
    </Tabs>
  );
}
