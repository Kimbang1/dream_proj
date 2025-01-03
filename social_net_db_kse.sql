create database social_net_db;
use social_net_db;

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
username	varchar(20)		not null		,
tag_id		varchar(20)		not null		,
email		varchar(100)	not null		,
phone		varchar(30)		not null		,
birthday	date			not null		,
is_admin	tinyint			default 0		,
provider	varchar(30)		not null		,
create_at	timestamp		default now()	,
is_using	tinyint			default	1		,
update_at	timestamp						,
is_update	tinyint			default 0		,
delete_at	timestamp						,
is_delete	tinyint			default 0		,
pwd			varchar(100)					,
social_key	varchar(36)						,
suspended_cnt	int			default 0 		,
introduce	varchar(100)					,
profile_path varchar(300)					,
constraint unique(tag_id)					,
constraint unique(email, provider)			, # -> 중복 회원가입 방지를 위함
constraint primary key(uuid)
);
drop table user;

desc user;
select * from user order by create_at;

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

select * from refresh_token_list order by create_at;

# file_list 파일 관리 테이블
create table file_list (
file_id			char(36)		not null		,
ori_filename	varchar(100)	not null		,
up_filename		varchar(100)	not null		,
file_path		varchar(300)	not null		,
insert_at		timestamp		default now()	,
is_using		tinyint							,
extension		varchar(20)		not null		,
captured_at		timestamp						,
latitude		double							,
longitude		double							,
constraint primary key(file_id)
);
drop table file_list;

select * from file_list order by insert_at desc;

# post 게시글 테이블
create table post (
post_id			char(36)		not null		,
write_user		char(36)						,
content			varchar(300)	not null		,
create_at		timestamp		default now()	,
is_using		tinyint			default 0		,
update_at		timestamp						,
is_update		tinyint			default 0		,
delete_at		timestamp						,
is_delete		tinyint			default 0		,
view_cnt		int				default 0		,
constraint fk_post_user foreign key(write_user) references user(uuid) on delete cascade,
constraint primary key(post_id)
);
drop table post;

select * from post order by create_at;

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

select * from file_post order by create_at;