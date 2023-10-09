import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
import weekdays from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { IPost } from "@/types/post";

dayjs.extend(utc)
dayjs.extend(isToday)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(weekdays)
dayjs.extend(isBetween)

// Unresolved function or method updateLocale()
// @ts-ignore
dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: '1s',
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

interface Post extends IPost {
  sub_post?: IPost
}

export function isLastMessage(current_created_at, next_created_at) {
  if (!current_created_at || !next_created_at) {
    return false
  }
  return dayjs(current_created_at).add(2, 'm').isBefore(dayjs(next_created_at))
}

// export function parseCreatedAts(arr: Post[]) {
export function parseCreatedAts(arr) {
  arr = arr.map((obj) => {
    if (obj?.sub_post) {
      obj.sub_post = parseCreatedAt(obj.sub_post)
    }
    return parseCreatedAt(obj)
  })
  return arr
}

export const parseCreatedAt = <T extends {created_at: Date}>(obj: T) => {
  if (dayjs(obj.created_at).isToday()) {
    return {
      ...obj,
      time: dayjs(obj.created_at).fromNow(),
      isExpiresEdit: dayjs().isBefore(dayjs(obj.created_at).add(1, 'h'))
    }
  } else {
    return { ...obj, time: dayjs(obj.created_at).format('MMM D') }
  }
}

export const parseMessageCreatedAt = <T extends {created_at: Date}>(obj: T) => {
  if (dayjs(obj.created_at).isToday()) {
    return { ...obj, time: dayjs(obj.created_at).format('hh:mm A') }
  } else {
    if (dayjs(obj.created_at).isBetween(dayjs().subtract(1, 'w'), dayjs().subtract(1, 'm'))) {
      return { ...obj, time: dayjs(obj.created_at).format('dddd hh:mm A') }
    }
    return { ...obj, time: dayjs(obj.created_at).format('D MMM YYYY, hh:mm A') }
  }
}
