import React from "react";
import {DislikesList, LikesList} from "@/widgets/liked-events-list";
import {TabBar, TabView} from "react-native-tab-view";
import {useWindowDimensions} from "react-native";
import {Box} from "@/shared/ui";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

export const LikesPage = React.memo(() => {
  const theme = useTheme<Theme>();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderScene = (scene: any) => {
    switch (scene.route.key) {
      case 'likes':
        return <LikesList/>;
      case 'dislikes':
        return <DislikesList/>
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor:  theme.colors.lime }}
      style={{ backgroundColor: theme.colors.bg_color }}
      activeColor={ theme.colors.text_color }
      inactiveColor={ theme.colors.gray }
    />
  );

  const routes = [
    { key: 'likes', title: 'Понравилось' },
    { key: 'dislikes', title: 'Не понравилось' },
  ];

  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
    >
      <TabView
        commonOptions={{
          labelStyle: theme.textVariants.body
        }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </Box>
  );
})
