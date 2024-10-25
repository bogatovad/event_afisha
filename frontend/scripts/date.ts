import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd.MM.yyyy HH:mm");
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const date = new Date(startDate);
  const dates = [];

  while (date <= new Date(endDate)) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
};
