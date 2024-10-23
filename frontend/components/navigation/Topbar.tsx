import React from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Pressable} from "react-native";

interface TopbarProps {
  onBackPress?: () => void,
  title: string,
  rightIcon?: React.ReactNode,
  onRightIconPress?: () => void,
}

const Topbar: React.FC<TopbarProps> = ({
  onBackPress = undefined,
  title = "",
  rightIcon,
  onRightIconPress
}) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      height={52}
      width="100%"
      flexDirection="row"
      padding="m"
      gap="m"
      alignItems="center"
      backgroundColor="bg_color"
    >
      {
        onBackPress && (
          <Pressable
            onPress={onBackPress}
          >
            <Ionicons name={"arrow-back"} size={20} color={theme.colors.text_color} />
          </Pressable>
        )
      }

      <Text
        variant="body"
        color="text_color"
        style={{
          flex: 1
        }}
      >
        { title }
      </Text>

      {
        rightIcon && (
          <Pressable
            onPress={ onRightIconPress }
          >
            { rightIcon }
          </Pressable>
        )
      }
    </Box>
  )
}

export default Topbar;
