import { DateTime } from 'luxon';

const MACHINE_DATE_REGEX = /([0-9]{4})-0?([0-9]+)-0?([0-9]+)/;

export const formatDate = (date: Date, fmt: string = 'dd/MM/yyyy') => {
  return DateTime.fromJSDate(date).toFormat(fmt);
};

export const formatDateTime = (
  date: Date,
  fmt: string = 'dd/MM/yyyy HH:mm',
) => {
  return DateTime.fromJSDate(date).toFormat(fmt);
};

export const formatDateTimeAccessibility = (
  date: Date,
): { date: string; time: string } => {
  return {
    date: formatDate(date),
    time: formatTime(date),
  };
};

export const formatDateWithTimeIfNotNull = (
  date: Date,
  fmtDate: string = 'dd/MM/yyyy',
  fmtDateTime: string = 'dd/MM/yyyy HH:mm',
) => {
  if (!date.getHours()) {
    return formatDate(date, fmtDate);
  }
  return formatDateTime(date, fmtDateTime);
};

export const formatMachineDate = (date: Date) => {
  return (
    `${date.getFullYear()}-` +
    `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
    `${date.getDate().toString().padStart(2, '0')}`
  );
};

export const formatTime = (date: Date, fmt = 'HH:mm') => {
  return DateTime.fromJSDate(date).toFormat(fmt);
};

const today = DateTime.now();

export const isCurrentMonth = (date: DateTime): boolean => {
  return today.year === date.year && today.month === date.month;
};

export const isCurrentYear = (date: DateTime): boolean => {
  return today.year === date.year;
};

export const convertMachineDateToFormatDate = (date: string) => {
  return date.replace(MACHINE_DATE_REGEX, '$3/$2/$1');
};
