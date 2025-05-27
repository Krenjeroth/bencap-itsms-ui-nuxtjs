import type {
  DatePickerDate,
  DatePickerRangeObject,
} from "v-calendar/dist/types/src/use/datePicker";

declare global {
  type TDatePickerDate = string | DatePickerDate | DatePickerRangeObject | null;
}
