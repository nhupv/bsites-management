export enum ContentStatus {
    PROCESSING = "processing",

    GET_LINK_SUCCESS = "parse-promt-success",
    GET_LINK_FAILED = "parse-promt-failed",

    SEND_CHATGPT_SUCCESS = "send-chatgpt-success",
    SEND_CHATGPT_FAILED = "send-chatgpt-failed",

    SEND_CONTENT_SUCCESS = "send-post-success",
    SEND_CONTENT_FAILED = "send-post-failed",

    SEND_UPDATE_POST_SUCCESS = "update-post-success",
    SEND_UPDATE_POST_FAILED = "update-post-failed",

    SEND_DELETE_POST_SUCCESS = "delete-post-success",
    SEND_DELETE_POST_FAILED = "delete-post-failed",
}
