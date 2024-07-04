export type FilterType = {
  query: string;
  brands: string[];
  category: string;
  discount: string;
};

export type PostType = {
  id?: string;
  _id?: string;
  title?: string;
  question: string;
  content?: string;
  category?: string;
  category_id?: number;
  categoryObj?: object | undefined;
  readonly status?: string[]
};

export type PostReq = {
  titles: string;
  category: object | null;
}

export enum PostStatus {
  PROCESSING = "processing",
  SEND_CHATGPT_SUCCESS = "send-chatgpt-success",
  SEND_CHATGPT_FAILED = "send-chatgpt-failed",

  PARSE_LINK_SUCCESS = "parse-promt-success",
  PARSE_LINK_FAILED = "parse-promt-failed",

  SEND_CONTENT_SUCCESS = "send-post-success",
  SEND_CONTENT_FAILED = "send-post-failed",

  SEND_UPDATE_POST_SUCCESS = "update-post-success",
  SEND_UPDATE_POST_FAILED = "update-post-failed",

  SEND_DELETE_POST_SUCCESS = "delete-post-success",
  SEND_DELETE_POST_FAILED = "delete-post-failed",

  SEND_POST_TO_GROUP_SUCCESS = "send-post-to-group-success",
  SEND_POST_TO_GROUP_FAILED = "send-post-to-group-failed",

  SEND_COMMENT_TO_POST_SUCCESS = "send-comment-to-post-success",
  SEND_COMMENT_TO_POST_FAILED = "send-comment-to-post-failed",

}
