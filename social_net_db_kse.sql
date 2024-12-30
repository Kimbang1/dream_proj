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
