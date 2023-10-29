
    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        conversation_Id bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FK24voyn8gjkgsedwra3osd6n9l 
       foreign key (conversation_Id) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];

    create table [User] (
       Id bigint identity not null,
        About nvarchar(MAX),
        AvatarUrl varchar(255),
        Country varchar(70),
        CoverImageUrl varchar(255),
        Created datetime2,
        DisplayName nvarchar(30) not null,
        IsPrivate bit,
        Password varchar(255),
        Provider varchar(20),
        SocialId varchar(255),
        Username varchar(100) not null,
        primary key (Id)
    );

    create table ChatConversation (
       Id bigint identity not null,
        Created datetime2 not null,
        IsRead bit not null,
        primary key (Id)
    );

    create table ChatMessage (
       id bigint identity not null,
        MediaType varchar(255),
        MediaUrl varchar(MAX),
        Text varchar(MAX),
        Edited bit,
        LastEditDate datetime2,
        Pinned bit,
        SentDate datetime2,
        ChatConversationId bigint,
        OwnerId bigint,
        primary key (id)
    );

    create table ChatParticipant (
       ConversationId bigint not null,
        UserId bigint not null,
        primary key (ConversationId, UserId)
    );

    create table Comment (
       Id bigint identity not null,
        CommentDate datetime2,
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        Text nvarchar(MAX),
        Upvotes int,
        ParentId bigint,
        PostId bigint,
        ReplyToId bigint,
        UserId bigint,
        primary key (Id)
    );

    create table CommentFollower (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table DownvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table FavoriteSection (
       UserId bigint not null,
        SectionId bigint not null,
        primary key (UserId, SectionId)
    );

    create table FollowingUser (
       UserId bigint not null,
        FollowerId bigint not null,
        primary key (UserId, FollowerId)
    );

    create table FollowRequest (
       Id bigint identity not null,
        created datetime2,
        Status int,
        ReceiverId bigint not null,
        SenderId bigint not null,
        primary key (Id)
    );

    create table Notification (
       Id bigint identity not null,
        Created datetime2,
        DestUrl varchar(MAX) not null,
        IsViewed bit,
        Message varchar(MAX),
        Type varchar(50) not null,
        UserId bigint,
        primary key (Id)
    );

    create table Post (
       Id bigint identity not null,
        Anonymous bit,
        ContentType varchar(255),
        Downvotes int,
        MediaType varchar(70),
        MediaUrl varchar(MAX),
        NotificationEnabled bit,
        SharedPostId bigint,
        Tags nvarchar(MAX),
        Text varchar(MAX),
        Title nvarchar(255),
        UploadTime datetime2,
        Upvotes int,
        SectionId bigint not null,
        UserId bigint not null,
        primary key (Id)
    );

    create table PostFollower (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table RecentUserSearch (
       SearcherId bigint not null,
        SearchedId bigint not null,
        primary key (SearcherId, SearchedId)
    );

    create table SavedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table Section (
       Id bigint identity not null,
        displayname nvarchar(MAX),
        ImgUrl varchar(MAX) not null,
        Name nvarchar(50) not null,
        primary key (Id)
    );

    create table UpvotedComment (
       UserId bigint not null,
        CommentId bigint not null,
        primary key (CommentId, UserId)
    );

    create table UpvotedPost (
       UserId bigint not null,
        PostId bigint not null,
        primary key (PostId, UserId)
    );

    create table UserBlock (
       id bigint not null,
        created datetime2 not null,
        BlockedId bigint not null,
        BlockerId bigint identity not null,
        primary key (BlockerId, BlockedId)
    );

    alter table [User] 
       add constraint UK_seh7nteifndaopocsq9f1w8ia unique (Username);

    alter table Section 
       add constraint UK_gjh3h937aj5wqcf5iad7mdqib unique (Name);

    alter table ChatMessage 
       add constraint FKw1ugu8wt8ar27of0el0flquf 
       foreign key (ChatConversationId) 
       references ChatConversation;

    alter table ChatMessage 
       add constraint FKsjk2dtyss97gj2gi43w4lxnn8 
       foreign key (OwnerId) 
       references [User];

    alter table ChatParticipant 
       add constraint FK1969ljclv9mxnor10qi7hcv80 
       foreign key (UserId) 
       references [User];

    alter table ChatParticipant 
       add constraint FKnna5kc36ttr34ixcqqq7l4uab 
       foreign key (ConversationId) 
       references ChatConversation;

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

    alter table CommentFollower 
       add constraint FKroiqavsfudhgj17n6icp606ga 
       foreign key (CommentId) 
       references Comment;

    alter table CommentFollower 
       add constraint FKf2tp19ane6yq67kx5nn42qk6e 
       foreign key (UserId) 
       references [User];

    alter table DownvotedComment 
       add constraint FKtoqp4sg8aiggi27hxlimk0ccy 
       foreign key (CommentId) 
       references Comment;

    alter table DownvotedComment 
       add constraint FK7o29kitikwnusk7j4ywop4k2v 
       foreign key (UserId) 
       references [User];

    alter table DownvotedPost 
       add constraint FKb8x8go2jce9tbgaowthqel89p 
       foreign key (PostId) 
       references Post;

    alter table DownvotedPost 
       add constraint FKqxxsehnvwuhf55raudglkwxx1 
       foreign key (UserId) 
       references [User];

    alter table FavoriteSection 
       add constraint FKofssdkcvhwh4jv83kkdxkej09 
       foreign key (SectionId) 
       references Section;

    alter table FavoriteSection 
       add constraint FKjfphp3ox3vfeswvet9opoe7ap 
       foreign key (UserId) 
       references [User];

    alter table FollowingUser 
       add constraint FK4f3ji0n38o5v0yjmfmuummjk4 
       foreign key (FollowerId) 
       references [User];

    alter table FollowingUser 
       add constraint FKr2i2m5eklw83e9jvw1tbmx01n 
       foreign key (UserId) 
       references [User];

    alter table FollowRequest 
       add constraint FKh3wqmqlrxiir02k1cvl2l7d7p 
       foreign key (ReceiverId) 
       references [User];

    alter table FollowRequest 
       add constraint FKir8udgkmo2i1babpalyq7dk82 
       foreign key (SenderId) 
       references [User];

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

    alter table PostFollower 
       add constraint FKqav2ic3xnl22dxgqtnv205081 
       foreign key (PostId) 
       references Post;

    alter table PostFollower 
       add constraint FKc6nd9e6r5ikrbxaqxgjdcpbuc 
       foreign key (UserId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FK2eegbajqd4pci19au7b8p6m44 
       foreign key (SearchedId) 
       references [User];

    alter table RecentUserSearch 
       add constraint FKn5wvim1m80o9l15lgmamkup41 
       foreign key (SearcherId) 
       references [User];

    alter table SavedPost 
       add constraint FKssmbopficykxdqm94hnp0qoce 
       foreign key (PostId) 
       references Post;

    alter table SavedPost 
       add constraint FK653k1846yaowns3mtbenby6 
       foreign key (UserId) 
       references [User];

    alter table UpvotedComment 
       add constraint FKryfi3v3pjuuydtvf3vnrua8f9 
       foreign key (CommentId) 
       references Comment;

    alter table UpvotedComment 
       add constraint FK39uc10nsrm1qghceh1pt5cnpa 
       foreign key (UserId) 
       references [User];

    alter table UpvotedPost 
       add constraint FK63skl8chv6del5pdi3uv2i7tv 
       foreign key (PostId) 
       references Post;

    alter table UpvotedPost 
       add constraint FKiqui3afyj09b1t6akas5o2rsj 
       foreign key (UserId) 
       references [User];

    alter table UserBlock 
       add constraint FKnvx41mqq6q3e8d3e0x23ghtdw 
       foreign key (BlockedId) 
       references [User];

    alter table UserBlock 
       add constraint FKmyl9py1n8cvfpw7x339imnocm 
       foreign key (BlockerId) 
       references [User];
