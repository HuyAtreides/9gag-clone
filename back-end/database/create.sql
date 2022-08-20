create database test2
go

use test2
GO

create table [User] (
    Id bigint identity not null,
    AvatarUrl varchar(255) default 'https://9gag-media-files.s3.ap-east-1.amazonaws.com/default-avatar.webp',
    Country varchar(70),
    DisplayName nvarchar(30) not null,
    Password varchar(255),
    Provider varchar(20),
    Created datetimeoffset default (sysutcdatetime()),
    Username varchar(20) not null,
    primary key (Id)
);

create table Comment (
    Id bigint identity not null,
    CommentDate datetimeoffset default (sysutcdatetime()),
    Downvotes int default 0 check (Downvotes >= 0),
    MediaType varchar(70),
    MediaUrl varchar(MAX),
    Text nvarchar(MAX),
    Upvotes int default 0 check (Upvotes >= 0),
    TotalChildren bigint default 0,
    ParentId bigint,
    PostId bigint,
    ReplyToId bigint,
    UserId bigint,
    primary key (Id)
);

create table FavoriteSection (
   SectionId bigint not null,
    UserId bigint not null,
    primary key (SectionId, UserId)
);

create table Notification (
    Id bigint identity not null,
    DestUrl varchar(MAX) not null,
    Type varchar(50) not null,
    UserId bigint,
    Created datetimeoffset default (sysutcdatetime()),
    IsViewed BIT DEFAULT 'FALSE',
    primary key (Id)
);

create table Post (
    Id bigint identity not null,
    Downvotes int default 0 check (Downvotes >= 0),
    MediaType varchar(70) not null,
    MediaUrl varchar(MAX) not null,
    Tags nvarchar(MAX),
    Title nvarchar(255),
    UploadTime datetimeoffset default (sysutcdatetime()),
    Upvotes int default 0 check (Upvotes >= 0),
    TotalComments bigint default 0,
    SectionId bigint not null,
    UserId bigint not null,
    primary key (Id)
);

create table SavedPost (
    UserId bigint not null,
    PostId bigint not null,
    primary key (UserId, PostId)
);

create table Section (
    Id bigint identity not null,
    ImgUrl varchar(MAX) not null,
    Name nvarchar(50) not null,
    primary key (Id)
);

create table VotedPost (
    UserId bigint not null,
    PostId bigint not null,
    primary key (UserId, PostId)
);

alter table [User]
   add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

alter table Section
   add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

alter table Comment
   add constraint FK2yn38ysl74hyqeq2kplawre4b
   foreign key (ParentId)
   references Comment;

alter table Comment
   add constraint FKi6fdwfcmir3gj63parutvxhux
   foreign key (PostId)
   references Post;

alter table Comment
   add constraint FKi3j3eis8cx4p4vymsrlju5p7l
   foreign key (ReplyToId)
   references Comment;

alter table Comment
   add constraint FKcam3tvchiu0p0lbe7k7qtk8ni
   foreign key (UserId)
   references [User];

alter table FavoriteSection
   add constraint FKjfphp3ox3vfeswvet9opoe7ap
   foreign key (UserId)
   references [User];

alter table FavoriteSection
   add constraint FKofssdkcvhwh4jv83kkdxkej09
   foreign key (SectionId)
   references Section;

alter table Notification
   add constraint FK5n1ndivf3vu0tagrwgy6op2pj
   foreign key (UserId)
   references [User];

alter table Post
   add constraint FKn1ah0jym7549ng8gltnd3vh1b
   foreign key (SectionId)
   references Section;

alter table Post
   add constraint FKngy8cjfrxhduudj70qb2vwikt
   foreign key (UserId)
   references [User];

alter table SavedPost
   add constraint FKssmbopficykxdqm94hnp0qoce
   foreign key (PostId)
   references Post;

alter table SavedPost
   add constraint FK653k1846yaowns3mtbenby6
   foreign key (UserId)
   references [User];

alter table VotedPost
   add constraint FKox6avkpw6sbc0uvdnj2lmxkl5
   foreign key (PostId)
   references Post;

alter table VotedPost
   add constraint FKgl5hudp0ubi0hg4vk90anjyln
   foreign key (UserId)
   references [User];


Insert into Section (ImgUrl, Name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1656473044.0987_Y3UVY8_100x100.jpg', 'anime-manga')
Insert into Section (ImgUrl, Name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557286907.1035_hE2uHE_100x100.jpg', 'movie-tv')
Insert into Section (ImgUrl, Name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557216707.0007_ESESyM_100x100.jpg', 'meme')
Insert into Section (ImgUrl, name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557286928.6604_uTYgug_100x100.jpg', 'gaming')
Insert into Section (imgUrl, name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557217995.2799_bYQyJU_100x100.jpg', 'awsome')
Insert into Section (imgUrl, name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557391851.3248_Za4UdA_100x100.jpg', 'animals')
Insert into section (imgUrl, name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1481541784.8502_e8ARAR_100x100.jpg', 'random')
Insert into section (ImgUrl, name) values ('https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557286779.394_WYru9a_100x100.jpg', 'science-tech')
