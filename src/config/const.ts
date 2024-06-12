export enum PAGE_PATHS {
  HOME = '/home',
  FOLLOWERS = '/followers',
  FOLLOWING = '/following',
  MESSAGES = '/messages',
  POSTS = '/posts',
  USER = '/user',
  SEARCH = '/search',
  ROOMS = '/rooms',
  EXPLORE = '/explore'
}

export enum POST_FILTER_BY {
  DEFAULT,
  COMMENTS,
  LIKES,
  MEDIA,
  FOLLOWING
}

export enum FILTER_SEARCH_ALL {
  TOP = 'top',
  LATEST = 'latest',
  PEOPLE = 'people',
  MEDIA = 'media'
}

export enum USER_FILTER_BY {
  DEFAULT,
  UNFOLLOW_CURRENT_USER,
  FOLLOWERS_BY_USERNAME,
  FOLLOWING_BY_USERNAME
}
