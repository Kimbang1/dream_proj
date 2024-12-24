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
pwd			varchar(30)						,
social_key	varchar(36)						,
suspended_cnt	int			default 0 		,
constraint unique(tag_id)					,
constraint unique(email, provider)			, # -> 중복 회원가입 방지를 위함
constraint primary key(uuid)
);
drop table user;

desc user;
select * from user order by create_at;
