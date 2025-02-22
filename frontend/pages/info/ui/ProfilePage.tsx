import React, {useCallback} from "react";
import {Image, Pressable} from "react-native";
import {useFocusEffect, useRouter} from "expo-router";
import {useOnboardingStore} from "@/widgets/onboarding-elements";
import {Box, Text} from "@/shared/ui";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {ProfileMenu} from "@/widgets/profile-menu";
import Icon from "@/shared/ui/Icons/Icon";

export const ProfilePage = () => {
  const router = useRouter();
  const { initDataUnsafe } = useConfig();

  useFocusEffect(
    useCallback(() => {
      useOnboardingStore.setState(() => ({ page: 1 }));
    }, [])
  )

  return (
    <Box
      flex={1}
      style={{ backgroundColor: "#FAFBFF"}}
      gap={"m"} justifyContent={"space-between"}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: 150,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <Pressable
        onPress={() => { router.back() }}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        <Box
          width={40} height={40} backgroundColor={"cardBGColor"}
          borderRadius={"eventCard"}
          alignItems={"center"} justifyContent={"center"}
        >
          <Icon name={"chevronLeft"} color={"white"} size={24}/>
        </Box>
      </Pressable>

      <Box
        flex={1}
        gap={"m"} style={{ marginTop: 80 }}
        alignItems={"center"}
      >
        <Image
          source={{ uri: initDataUnsafe.user.photo_url }}
          style={{
            width: "100%", height: "100%",
            maxWidth: 150, maxHeight: 150,
            borderRadius: 500
          }}
        />

        <Text
          variant={"cardHeader"}
          color={"black"}
          textAlign={"center"}
        >
          { initDataUnsafe.user.first_name }
        </Text>
      </Box>

      <ProfileMenu/>
    </Box>
  );
}
