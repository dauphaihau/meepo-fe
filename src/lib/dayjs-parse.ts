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
    m: "1m",
    mm: "%dm",
    h: "h",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

interface Post extends IPost{
  sub_post?: IPost
}

export function parseTimePosts(posts: Post[]) {
  posts = posts.map((p) => {

    if (p.sub_post) {
      p.sub_post = parseTimePost(p.sub_post)
    }

    if (dayjs(p.created_at).isToday()) {
      return { ...p, time: dayjs(p.created_at).fromNow() }
    } else {
      return { ...p, time: dayjs(p.created_at).format('MMM D') }
    }
  })

  return posts
}

export function parseTimePost(post: IPost) {
  if (dayjs(post.created_at).isToday()) {
    return { ...post, time: dayjs(post.created_at).fromNow() }
  } else {
    return { ...post, time: dayjs(post.created_at).format('MMM D') }
  }
}
