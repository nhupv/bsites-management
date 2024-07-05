export enum ContentStatus {
    PROCESSING = "processing",

    GET_LINK_SUCCESS = "parse-promt-success",
    GET_LINK_FAILED = "parse-promt-failed",
    UPLOAD_IMAGE_FAILED = "upload-image-failed",

    SEND_CHATGPT_SUCCESS = "send-chatgpt-success",
    SEND_CHATGPT_FAILED = "send-chatgpt-failed",

    SEND_CONTENT_SUCCESS = "send-post-success",
    SEND_CONTENT_FAILED = "send-post-failed",

    SEND_UPDATE_POST_SUCCESS = "update-post-success",
    SEND_UPDATE_POST_FAILED = "update-post-failed",

    SEND_DELETE_POST_SUCCESS = "delete-post-success",
    SEND_DELETE_POST_FAILED = "delete-post-failed",

    SEND_POST_TO_GROUP_SUCCESS = "send-post-to-page-success",
    SEND_POST_TO_GROUP_FAILED = "send-post-to-page-failed",

    SEND_COMMENT_TO_POST_SUCCESS = "send-comment-to-post-success",
    SEND_COMMENT_TO_POST_FAILED = "send-comment-to-post-failed",
}
