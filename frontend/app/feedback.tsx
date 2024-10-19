import {Pressable, TextInput} from 'react-native';

import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import {useState} from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";

export default function FeedbackScreen() {
  const theme = useTheme<Theme>();
  const [text, setText] = useState("");

  return (
    <Box
      flex={1}
      gap="l"
      backgroundColor="bg_color"
      style={{
        padding: 32
      }}
    >
      <Text
        variant="header"
        color="text_color"
        textAlign="center"
      >
        { "Обратная связь" }
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={ "Можешь написать здесь всё, что угодно" }
        placeholderTextColor={theme.colors.hint_color}
        textAlignVertical="bottom"
        multiline={true}
        selectionColor={theme.colors.button_color}
        style={{
          flex: 1,
          height: "100%",
          color: theme.colors.text_color,
          fontFamily: "InterRegular",
          textAlignVertical: "top"
        }}
      />

      <Pressable
        onPress={ () => { console.log("SUBMIT PRESSED") }}
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
            { "Отправить" }
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
}
