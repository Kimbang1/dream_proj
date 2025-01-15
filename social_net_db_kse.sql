create database social_net_db;
use social_net_db;
show tables;

select @@time_zone, @@system_time_zone;
select now();

# 테스트용 테이블
create table kse_test (
num			int			auto_increment	,
username	char(10)	not null		,
age			int			not null		,
dazim		char(200)					,
constraint primary key(num)
);

select * from kse_test;

# user 테이블
create table user (
uuid		char(36)		not null		,
username	varchar(20)						,
tag_id		varchar(20)						,
email		varchar(100)	not null		,
phone		varchar(30)						,
birthday	date							,
is_admin	tinyint			default 0		,
provider	varchar(30)		not null		,
create_at	timestamp						,
is_using	tinyint			default	0		,
update_at	timestamp						,
is_update	tinyint			default 0		,
delete_at	timestamp						,
is_delete	tinyint			default 0		,
pwd			varchar(100)					,
social_key	varchar(100)					,
suspended_cnt	int			default 0 		,
introduce	varchar(100)					,
profile_path varchar(300)					,
constraint unique(tag_id)					,
constraint unique(email, provider)			, # -> 중복 회원가입 방지를 위함
constraint primary key(uuid)
);
drop table user;

desc user;
select * from user order by create_at desc;
delete from user where email="admin@admin.com";
update user set username="" where uuid="";

# refresh_token 관리 테이블
create table refresh_token_list (
re_token	varchar(100)	not null		,
uuid		char(36)		not null		,
user_agent	varchar(255)					,
create_at	timestamp						,
is_using	tinyint			default 1		,
expires_in	timestamp						,
constraint fk_refresh_token_user foreign key(uuid) references user(uuid) on delete cascade,
constraint primary key(re_token)
);
drop table refresh_token_list;

desc refresh_token_list;
select * from refresh_token_list order by create_at;

# file_list 파일 관리 테이블
create table file_list (
file_id			char(36)		not null		,
ori_filename	varchar(100)	not null		,
up_filename		varchar(100)	not null		,
file_path		varchar(300)	not null		,
insert_at		timestamp		default now()	,
is_using		tinyint			default 0		,
extension		varchar(20)		not null		,
captured_at		timestamp						,
latitude		double							,
longitude		double							,
constraint primary key(file_id)
);
drop table file_list;

desc file_list;
select * from file_list order by insert_at desc;

# post 게시글 테이블
create table post (
post_id			char(36)		not null		,
write_user		char(36)						,
content			varchar(300)	not null		,
create_at		timestamp		default now()	,
is_using		tinyint			default 1		,
update_at		timestamp						,
is_update		tinyint			default 0		,
delete_at		timestamp						,
is_delete		tinyint			default 0		,
view_cnt		int				default 0		,
constraint fk_post_user foreign key(write_user) references user(uuid) on delete cascade,
constraint primary key(post_id)
);
drop table post;

desc post;
select * from post order by create_at desc;

# file_post 파일과 게시글을 묶어주는 중간 테이블
create table file_post (
link_id			char(36)		not null		,
file_id			char(36)						,
post_id			char(36)						,
create_at		timestamp		 				,
is_using		tinyint			default 0		,
constraint fk_filePost_file foreign key(file_id) references file_list(file_id) on delete cascade,
constraint fk_filePost_post foreign key(post_id) references post(post_id) on delete cascade,
constraint primary key(link_id)
);
drop table file_post;

desc file_post;
select * from file_post order by create_at desc;

SELECT 
    p.post_id AS post_id,
    p.write_user,
    p.content,
    p.create_at,
    f.file_id AS file_id,
    f.up_filename,
    f.file_path
FROM 
    post p
LEFT JOIN 
    file_post fp ON p.post_id = fp.post_id
LEFT JOIN 
    file_list f ON fp.file_id = f.file_id
WHERE 
    p.write_user = '9a6fdc66-46cc-4445-8d2b-dd8a8ed2705c'
ORDER BY 
    p.create_at DESC;
    
create table comment (
comment_id		char(36)		not null		,
user_id			char(36)		not null		,
user_tag_id		varchar(20)						,
parent_post		char(36)		not null		,
content			varchar(300)	not null		,
create_at		timestamp		default now()	,
is_using		tinyint			default 1		,
update_at		timestamp						,
is_update		tinyint			default 0		,
delete_at		timestamp						,
is_delete		tinyint			default 0		,
constraint fk_comment_post foreign key(parent_post) references post(post_id) on delete cascade,
constraint fk_comment_user_tagId foreign key(user_tag_id) references user(tag_id) on delete cascade,
constraint fk_comment_user_uuid foreign key(user_id) references user(uuid) on delete cascade,
constraint primary key(comment_id)
);
drop table comment;
desc comment;
select * from comment order by create_at desc;

create table view_list (
num			int			auto_increment	,
user_id		char(36)	not null		,
post_id		char(36)	not null		,
create_at	timestamp   default now()	,
quarter		int							,
constraint fk_viewList_post foreign key(post_id) references post(post_id) on delete cascade,
constraint fk_viewList_user foreign key(user_id) references user(uuid) on delete cascade,
constraint primary key(num)
);
drop table view_list;

desc view_list;
select * from view_list order by create_at desc;

create table post_like (
num			int			auto_increment	,
user_id		char(36)					,
post_id		char(36)					,
constraint fk_postLike_user foreign key(user_id) references user(uuid) on delete cascade,
constraint fk_postLike_post foreign key(post_id) references post(post_id) on delete cascade,
constraint primary key(num)
);
drop table post_like;

desc post_like;
select * from post_like order by num desc;



create table user_del_list (
del_id		char(36)		not null		,
del_user	char(36)		not null		,
manager		varchar(20)		not null		,
manager_id	char(36)		not null		,
reason		varchar(300)					,
create_at	timestamp		default now()	,
# constraint fk_userDelList_user_manager foreign key(manager_id) references user(uuid) on delete cascade,
# constraint fk_userDelList_user_user foreign key(del_user) references user(uuid) on delete cascade,
constraint primary key(del_id)
);
drop table user_del_list;