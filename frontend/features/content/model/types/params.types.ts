/**
 * Structure of params to get events
 */
export type ContentParams = {
  username: string,
  tag?: string,
  date_start?: string,
  date_end?: string
}

export type FeedParams = {
  username: string,
  date_start?: string,
  date_end?: string
}
