import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import weekdays from 'dayjs/plugin/weekday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(weekdays);
dayjs.extend(isBetween);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

export function isLastMessage(current_created_at: Date, next_created_at: Date) {
  if (!dayjs(current_created_at).isValid() || !dayjs(next_created_at).isValid()) {
    return false;
  }
  return dayjs(current_created_at).add(2, 'm').isBefore(dayjs(next_created_at));
}

export const parseTimeFromNow = (time?: Date): string => {
  if (dayjs(time).isValid()) {
    return dayjs(time).fromNow();
  }
  return '';
};

export const parseMessageCreatedAt = <T extends {created_at: Date}>(obj: T) => {
  if (dayjs(obj.created_at).isToday()) {
    return { ...obj, time: dayjs(obj.created_at).format('hh:mm A') };
  }
  else {
    if (dayjs(obj.created_at).isBetween(dayjs().subtract(1, 'w'), dayjs().subtract(1, 'm'))) {
      return { ...obj, time: dayjs(obj.created_at).format('dddd hh:mm A') };
    }
    return { ...obj, time: dayjs(obj.created_at).format('D MMM YYYY, hh:mm A') };
  }
};
