export type Theme = {
  colors: TelegramTheme;
  spacing: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  textVariants: {
    header: {
      fontFamily: string;
      fontSize: number;
    };
    body: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
    };
    defaults: {};
  };
};
