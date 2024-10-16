import {createTheme} from '@shopify/restyle';
import {config} from "@/scripts/config";

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A906E',

  black: '#0B0B0B',
  white: '#ffffff',
};

const cfg = config()

const theme = createTheme({
  colors: {
    bg_color: cfg.themeParams.bg_color,
    secondary_bg_color: cfg.themeParams.secondary_bg_color,
    section_bg_color: cfg.themeParams.section_bg_color,
    section_separator_color: cfg.themeParams.section_separator_color,
    header_bg_color: cfg.themeParams.header_bg_color,
    text_color: cfg.themeParams.text_color,
    hint_color: cfg.themeParams.hint_color,
    link_color: cfg.themeParams.link_color,
    button_color: cfg.themeParams.button_color,
    button_text_color: cfg.themeParams.button_text_color,
    accent_text_color: cfg.themeParams.accent_text_color,
    section_header_text_color: cfg.themeParams.section_header_text_color,
    subtitle_text_color: cfg.themeParams.subtitle_text_color,
    destructive_text_color: cfg.themeParams.destructive_text_color,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontFamily: 'InterMedium',
      fontSize: 28,
    },
    body: {
      fontFamily: 'InterRegular',
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
});

export type Theme = typeof theme;
export default theme;
