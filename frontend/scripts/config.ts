import { Platform } from "react-native";

export const MockConfig = {
  themeParams: {
    bg_color: "#292929",
    secondary_bg_color: "#1f1f1f",
    section_bg_color: "#000",
    section_separator_color: "#8b8b8b",
    header_bg_color: "#2c2c2c",
    text_color: "#fff",
    hint_color: "#949494",
    link_color: "",
    button_color: "#358ffe",
    button_text_color: "",
    accent_text_color: "#0f75f1",
    section_header_text_color: "",
    subtitle_text_color: "",
    destructive_text_color: "",
  },
  initDataUnsafe: {
    user: {
      username: "",
      is_premium: false,
      photo_url: "",
      first_name: "",
      last_name: "",
      id: 0,
    },
  },
} as TelegramWebapp;


export const config = () : TelegramWebapp => {
  if (Platform.OS !== "web") {
    return MockConfig;
  }

  // @ts-ignore
  if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
    // @ts-ignore
    return window.Telegram?.WebApp;
  } else {

    return MockConfig;
  }
};
