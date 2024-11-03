import {create} from "zustand/index";
import {MarkedDates} from "react-native-calendars/src/types";
import {DateData} from "react-native-calendars";
import {getDatesInRange} from "@/shared/scripts/date";

interface CalendarState {
  isCalendarVisible: boolean;
  selectedDays: MarkedDates;
  updateSelectedDays: (day: DateData) => void;
  clearSelectedDays: () => void;
  setCalendarVisible: (visible: boolean) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  isCalendarVisible: false,
  selectedDays: {},

  updateSelectedDays: (day: DateData) => {
    set((state) => {
      const newSelectedDays = { ...state.selectedDays };

      if (!newSelectedDays[day.dateString]) {
        newSelectedDays[day.dateString] = { selected: true };
      } else {
        delete newSelectedDays[day.dateString];
      }

      const sortedDates = Object.keys(newSelectedDays)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const updatedSelectedDays: MarkedDates = {};

      if (sortedDates.length > 0) {
        const startingDay = sortedDates[0];
        const endingDay = sortedDates[sortedDates.length - 1];

        const rangeDates = getDatesInRange(startingDay, endingDay);

        rangeDates.forEach((date) => {
          updatedSelectedDays[date] = {
            selected: true,
            color: "#358ffe",
            startingDay: date === startingDay,
            endingDay: date === endingDay,
          };
        });
      }

      return { selectedDays: updatedSelectedDays };
    });
  },

  clearSelectedDays: () => {
    set({ selectedDays: {} })
  },

  setCalendarVisible: (visible: boolean) => {
    set({ isCalendarVisible: visible });
  },
}));
