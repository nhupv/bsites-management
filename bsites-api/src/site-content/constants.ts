export const POSTS_QUEUE = {
  INSERT_STATS_QUEUE: 'insert-post-queue',
  INSERT_STATS_JOB: 'insert-post-job',
  INSERT_POST_LINK_JOB: 'insert-post-link-job',
  INSERT_PARSE_LINK_JOB: 'insert-parse-link-job',
};

export const POSTS_SEND_TO_SITE_QUEUE = {
  INSERT_STATS_QUEUE: 'insert-post-send-to-site-queue',
  INSERT_STATS_JOB: 'insert-post-send-to-site-job',
  INSERT_UPDATE_JOB: 'insert-update-post-to-site-job',
  INSERT_DELETE_JOB: 'insert-delete-post-to-site-job',
};

export const POSTS_SEND_TO_FB_QUEUE = {
  INSERT_STATS_QUEUE: 'post-send-to-fb-page-queue',
  SEND_UPLOAD_IMAGE_POST: 'send-upload-image-post-job',
  SEND_POST_TO_GROUP: 'send-post-to-page-job',
};

export const COMMENT_SEND_TO_POST_QUEUE = {
  INSERT_COMMENT_QUEUE: 'comment-send-to-post-queue',
  SEND_COMMENT_TO_POST: 'send-comment-to-post-job',
};
