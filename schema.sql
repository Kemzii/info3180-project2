drop database if exists photogram;
create database photogram;

create table posts (
    id varchar primary key,
    user_id varchar(255) not null,
    photo varchar(255) not null,
    caption varchar(255) not null,
    created_on varchar(255) not null
    );
    
create table users (
    id varchar primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    email varchar(255) not null,
    location varchar(255) not null,
    biography varchar(255) not null,
    profile_photo varchar(255) not null,
    joined_on varchar(255) not null
    );
    
create table likes (
    id varchar primary key,
    user_id varchar(255) not null,
    post_id varchar(255) not null
    );
    
create table follows (
    id varchar primary key,
    user_id varchar(255) not null,
    follower_id varchar(255) not null
    );
    
create user "project2";
\password project2
testpass
alter database photogram owner to project2;
