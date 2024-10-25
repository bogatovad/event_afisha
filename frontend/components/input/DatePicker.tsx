import React from "react";
import Box from "@/components/Box";
import {Calendar, DateData} from "react-native-calendars";
import {Pressable} from "react-native";
import Text from "@/components/Text";
import {MarkedDates} from "react-native-calendars/src/types";

interface DatePickerProps {
  selectedDays: MarkedDates,
  onDaySelected: (day: DateData) => void,
  onClear: () => void,
  onAccept: () => void
}

const DatePicker: React.FC<DatePickerProps> = ({
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

export default DatePicker;