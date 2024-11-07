import {Spacing, BorderRadii, Text} from "@/shared/constants";

export type Theme = {
  colors: TelegramTheme & {
    cardBGColor: string,
    cardMainTextColor: string,
    cardSubtextColor: string,
    lime: string,
    black: string,
    gray: string,
  };
  spacing: typeof Spacing;
  borderRadii: typeof BorderRadii
  textVariants: typeof Text;
};
