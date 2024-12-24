
CREATE TABLE comment
(
  num                 int               NOT NULL AUTO_INCREMENT,
  loginid             CHAR(20)          NOT NULL COMMENT 'rk = user',
  content             VARCHAR(300)      NOT NULL,
  parentPost          int               NOT NULL COMMENT 'rk = post',
  numparentComment    int               NULL     COMMENT 'rk = comment',
  depth               int               NULL     DEFAULT 0,
  likes               int               NULL     DEFAULT 0,
  commentCnt          int               NULL     DEFAULT 0,
  orderNumber         int               NULL    ,
  isCommentForComment ENUM(TRUE, FALSE) NOT NULL DEFAULT FALSE,
  regTM               TIMESTAMP         NULL     DEFAULT now(),
  PRIMARY KEY (num)
) COMMENT 'comment to post';

CREATE TABLE followList
(
  follow_id int       NOT NULL AUTO_INCREMENT,
  from_user CHAR(20)  NOT NULL COMMENT 'rk = user',
  to_user   CHAR(20)  NOT NULL COMMENT 'rk = user',
  createTM  TIMESTAMP NULL     DEFAULT now(),
  PRIMARY KEY (follow_id)
);

CREATE TABLE likes
(
  num      int       NOT NULL AUTO_INCREMENT,
  user_id  CHAR(20)  NOT NULL COMMENT 'rk = user',
  post_num int       NOT NULL COMMENT 'rk = post',
  createTM TIMESTAMP NULL     DEFAULT now(),
  PRIMARY KEY (num)
) COMMENT 'for post';

CREATE TABLE notification
(
  num            int          NOT NULL AUTO_INCREMENT,
  user_id        CHAR(20)     NOT NULL COMMENT 'rk=user / 알림 받는 회원',
  target_user_id CHAR(20)     NULL     COMMENT 'rk=user / 알림을 받게한 회원',
  not_type       CHAR(20)     NOT NULL COMMENT '알림 종류',
  not_post_id    int          NULL     COMMENT 'rk=post / 알림을 받게한 글',
  not_msg        VARCHAR(100) NOT NULL COMMENT '알림 내용',
  not_url        VARCHAR(300) NULL     COMMENT '알림 클릭 시 연결 주소',
  not_createTM   TIMESTAMP    NULL     DEFAULT now() COMMENT '알림 발생 시간',
  not_readTM     TIMESTAMP    NULL     COMMENT '알림 확인 시간',
  PRIMARY KEY (num)
);

CREATE TABLE post
(
  num        int          NOT NULL AUTO_INCREMENT,
  loginid    CHAR(20)     NOT NULL COMMENT 'rk = user',
  content    VARCHAR(300) NOT NULL,
  filename   VARCHAR(50)  NOT NULL,
  views      int          NULL     DEFAULT 0,
  likes      int          NULL     DEFAULT 0,
  commentCnt int          NULL     DEFAULT 0,
  regTM      TIMESTAMP    NULL     DEFAULT now(),
  PRIMARY KEY (num)
) COMMENT 'post table';

CREATE TABLE user
(
  num      int                  NOT NULL AUTO_INCREMENT,
  username CHAR(20)             NOT NULL,
  loginid  CHAR(20)             NOT NULL,
  userid   CHAR(20)             NOT NULL,
  userpw   CHAR(20)             NOT NULL,
  pwkey    CHAR(20)             NOT NULL,
  birthday CHAR(10)             NOT NULL,
  gender   ENUM(F, M, NB, NONE) NOT NULL,
  email    char(40)             NOT NULL,
  phone    char(15)             NULL    ,
  class    ENUM(ADMIN, USER)    NOT NULL DEFAULT USER,
  regTM    TIMESTAMP            NULL     DEFAULT now(),
  PRIMARY KEY (loginid)
) COMMENT 'sns user table';

ALTER TABLE user
  ADD CONSTRAINT UQ_num UNIQUE (num);

ALTER TABLE user
  ADD CONSTRAINT UQ_userid UNIQUE (userid);

ALTER TABLE post
  ADD CONSTRAINT FK_user_TO_post
    FOREIGN KEY (loginid)
    REFERENCES user (loginid);

ALTER TABLE comment
  ADD CONSTRAINT FK_user_TO_comment
    FOREIGN KEY (loginid)
    REFERENCES user (loginid);

ALTER TABLE comment
  ADD CONSTRAINT FK_post_TO_comment
    FOREIGN KEY (parentPost)
    REFERENCES post (num);

ALTER TABLE comment
  ADD CONSTRAINT FK_comment_TO_comment
    FOREIGN KEY (numparentComment)
    REFERENCES comment (num);

ALTER TABLE followList
  ADD CONSTRAINT FK_user_TO_followList
    FOREIGN KEY (from_user)
    REFERENCES user (loginid);

ALTER TABLE followList
  ADD CONSTRAINT FK_user_TO_followList1
    FOREIGN KEY (to_user)
    REFERENCES user (loginid);

ALTER TABLE likes
  ADD CONSTRAINT FK_user_TO_likes
    FOREIGN KEY (user_id)
    REFERENCES user (loginid);

ALTER TABLE likes
  ADD CONSTRAINT FK_post_TO_likes
    FOREIGN KEY (post_num)
    REFERENCES post (num);

ALTER TABLE notification
  ADD CONSTRAINT FK_user_TO_notification
    FOREIGN KEY (user_id)
    REFERENCES user (loginid);

ALTER TABLE notification
  ADD CONSTRAINT FK_user_TO_notification1
    FOREIGN KEY (target_user_id)
    REFERENCES user (loginid);

ALTER TABLE notification
  ADD CONSTRAINT FK_comment_TO_notification
    FOREIGN KEY (not_post_id)
    REFERENCES comment (num);
