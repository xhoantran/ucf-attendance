import { default as dayjs } from "dayjs";

export const formatDate = (date: number | string) =>
  dayjs(date).format("MMMM D, YYYY h:mm A");
