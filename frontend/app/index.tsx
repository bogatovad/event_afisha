import {Linking, Pressable, ScrollView} from 'react-native';

import Box from "@/components/Box";
import Text from "@/components/Text";
import {config} from "@/scripts/config";
import WebLottieView from "@/components/containers/WebLottieView";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";

export default function HomeScreen() {
  const theme = useTheme<Theme>();
  const { first_name } = config().initDataUnsafe.user;

  return (
    <ScrollView
      overScrollMode={"never"}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: theme.colors.secondary_bg_color
      }}
    >
      <Box
        height={220}
        width={"100%"}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text
          variant="header"
          fontSize={110}
          color={"bg_color"}
          textAlign={"center"}
          style={{
            position: "absolute",
            top: 0
          }}
        >
          EVENT
        </Text>

        <Text
          variant="header"
          fontSize={110}
          color={"bg_color"}
          textAlign={"center"}
          style={{
            position: "absolute",
            bottom: 0
          }}
        >
          AFISHA
        </Text>

        <Box
          style={{
            position: "absolute",
            top: -10
          }}
        >
          <WebLottieView src={require("@/assets/lottie/waving.json")}/>
        </Box>
      </Box>

      <Box
        flex={1}
        backgroundColor="bg_color"
        style={{
          gap: 20
        }}
      >
        <Text
          variant="header"
          color="text_color"
          textAlign={"center"}
          style={{
            paddingTop: 32,
            paddingHorizontal: 32
          }}
        >
          { first_name ? `Привет, ${ first_name }!` : 'Привет!' }
        </Text>

        <Text
          variant="body"
          color="text_color"
          style={{
            paddingHorizontal: 32
          }}
        >
          { '🎯 Наша задача: Упростить твой поиск событий в любимом городе' }
        </Text>

        <WebLottieView src={require("@/assets/lottie/search.json")}/>

        <Text
          variant="body"
          color="text_color"
          style={{
            paddingHorizontal: 32
          }}
        >
          { '✨ Сейчас доступно только взаимодействие через телеграм-бота, но совсем скоро в этом приложение появится красивый интерфейс' }
        </Text>

        <WebLottieView src={require("@/assets/lottie/swipe.json")}/>

        <Text
          variant="body"
          color="text_color"
          style={{
            paddingHorizontal: 32
          }}
        >
          { '📋 Мы всегда будем рады твоим отзывам и предложениям 👇' }
        </Text>

        <Pressable
          style={{
            paddingHorizontal: 32,
            paddingBottom: 32
          }}
          onPress={() => {Linking.openURL("https://google.com").then(r => console.log(r))}}
        >
          <Box
            backgroundColor="button_color"
            height={52}
            width={"100%"}
            alignItems="center"
            justifyContent="center"
            style={{
              borderRadius: 12,
            }}
          >
            <Text
              variant="body"
              color="button_text_color"
            >
              { "Форма обратной связи"}
            </Text>
          </Box>
        </Pressable>
      </Box>
    </ScrollView>
  );
}
