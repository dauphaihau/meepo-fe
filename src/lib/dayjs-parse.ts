import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { IPost } from "@/types/post";

dayjs.extend(utc)
dayjs.extend(isToday)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

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

// export function parseCreatedAts(arr: Post[]) {
export function parseCreatedAts(arr) {
  arr = arr.map((obj) => {

    if (obj?.sub_post) {
      obj.sub_post = parseCreatedAt(obj.sub_post)
    }

    if (dayjs(obj.created_at).isToday()) {
      return { ...obj, time: dayjs(obj.created_at).fromNow() }
    } else {
      return { ...obj, time: dayjs(obj.created_at).format('MMM D') }
    }
  })

  return arr
}

export const parseCreatedAt = <T extends {created_at: Date}>(obj: T) => {
  if (dayjs(obj.created_at).isToday()) {
    return { ...obj, time: dayjs(obj.created_at).fromNow() }
  } else {
    return { ...obj, time: dayjs(obj.created_at).format('MMM D') }
  }
}

export const parseMessageCreatedAt = <T extends {created_at: Date}>(obj: T) => {
  if (dayjs(obj.created_at).isToday()) {
    return { ...obj, time: dayjs(obj.created_at).format('hh:mm A') }
  } else {
    return { ...obj, time: dayjs(obj.created_at).format('MMM D, YYYY, hh:mm A') }
  }
}
