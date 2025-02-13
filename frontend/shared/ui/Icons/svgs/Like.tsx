import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Like: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
  >
    <Path
      d="M12.432 19.05l-.1.1-.11-.1c-4.75-4.31-7.89-7.16-7.89-10.05 0-2 1.5-3.5 3.5-3.5 1.54 0 3.04 1 3.57 2.36h1.86c.53-1.36 2.03-2.36 3.57-2.36 2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05zm4.4-15.55c-1.74 0-3.41.81-4.5 2.08-1.09-1.27-2.76-2.08-4.5-2.08-3.08 0-5.5 2.41-5.5 5.5 0 3.77 3.4 6.86 8.55 11.53l1.45 1.32 1.45-1.32c5.15-4.67 8.55-7.76 8.55-11.53 0-3.09-2.42-5.5-5.5-5.5z"
      fill={fill}
    />
  </Svg>
);

export default Like;
