import React from "react";
import {Pressable} from "react-native";
import {Calendar, DateData} from "react-native-calendars";
import {MarkedDates} from "react-native-calendars/src/types";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";

interface DatePickerProps {
  selectedDays: MarkedDates,
  onDaySelected: (day: DateData) => void,
  onClear: () => void,
  onAccept: () => void
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDays,
  onDaySelected,
  onClear,
  onAccept
}) => {
  const minDate = new Date();

  return (
    <Box
      overflow={"hidden"}
      style={{
        borderRadius: 8
      }}
    >
      <Calendar
        minDate={minDate.toString()}
        markingType={"period"}
        markedDates={selectedDays}
        onDayPress={onDaySelected}
      />

      <Box
        flexDirection="row"
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingHorizontal="xl"
        style={{
          backgroundColor: "white"
        }}
      >
        <Pressable
          onPress={ onClear }
        >
          <Box
            width={"100%"}
            height={40}
            alignItems={"center"}
            justifyContent={"center"}
            padding="s"
          >
            <Text
              variant="body"
              style={{
                color: "black"
              }}
            >
              { "Сбросить" }
            </Text>
          </Box>
        </Pressable>

        <Pressable
          onPress={ onAccept }
        >
          <Box
            width={"100%"}
            height={40}
            alignItems={"center"}
            justifyContent={"center"}
            padding="s"
          >
            <Text
              variant="body"
              color="button_color"
            >
              { "Применить" }
            </Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}
