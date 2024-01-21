package com.huyphan.repositories;

import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatParticipant;
import com.huyphan.models.User;
import com.huyphan.models.enums.ChatConversationSortField;
import com.huyphan.models.enums.ChatConversationSortField.Constants;
import com.huyphan.models.projections.ChatConversationWithDerivedFields;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ChatConversationRepository extends CrudRepository<ChatConversation, Long> {

    String SELECT_STATEMENT = """
            select
                conversation as chatConversation,
                
                (
                    select max(chatMessage.id)
                    from ChatMessage chatMessage
                    where chatMessage.conversation.id = conversation.id
                ) as latestChatMessageId
            """;
    String PARTICIPANT_BLOCKS_EACH_OTHER_FILTER = """
            not exists (
                                select userBlockRecord
                                from UserBlockRecord userBlockRecord
                                where userBlockRecord.blocked = elements(conversation.participants)
                                      and userBlockRecord.blocker = elements(conversation.participants)
                       )
                        
            """;

    String RESTRICT_PARTICIPANT_FILTER = """
            not exists (
                select record
                from RestrictRecord record
                where record.restricting = :user and record.restricted in elements(conversation.participants)
            )
            """;

    @Query("""
            select conversation
            from ChatConversation conversation
            where not exists (
                select user
                from User user
                where user in elements(conversation.participants) and user not in :participants
            )
            """)
    Optional<ChatConversation> findConversationWithParticipants(
            @Param("participants") Set<ChatParticipant> participants
    );

    @Query(SELECT_STATEMENT + """
            from ChatConversation conversation
            where :user in elements(conversation.participants)
            and
            """ + PARTICIPANT_BLOCKS_EACH_OTHER_FILTER + " and " + RESTRICT_PARTICIPANT_FILTER)
    Slice<ChatConversationWithDerivedFields> getAllConversationsOfCurrentUser(
            @Param("user") User currentUser,
            Pageable pageable
    );

    @Query(SELECT_STATEMENT + """
            from ChatConversation conversation
            where :user in elements(conversation.participants) and exists (
                select message
                from ChatMessage message
                where message.conversation.id = conversation.id
                and message.sentDate > message.conversation.deleteAt
            ) and
            """ + PARTICIPANT_BLOCKS_EACH_OTHER_FILTER + " and " + RESTRICT_PARTICIPANT_FILTER)
    Slice<ChatConversationWithDerivedFields> getCurrentUserNonEmptyConversations(
            @Param("user") User currentUser,
            Pageable pageable
    );

    @Query(SELECT_STATEMENT + """
            from ChatConversation conversation
            where conversation.id = :id
            """)
    ChatConversationWithDerivedFields findConversationWithDerivedFieldsById(
            @Param("id") Long id
    );

    @Query(SELECT_STATEMENT + """
            from ChatConversation conversation inner join conversation.participants participant
            where :user in elements(conversation.participants) and exists (
                select message
                from ChatMessage message
                where message.conversation.id = conversation.id
            ) and (lower(participant.username) like :searchTerm or lower(participant.displayName) like :searchTerm)
            and participant != :user and
            """ + PARTICIPANT_BLOCKS_EACH_OTHER_FILTER + " and " + RESTRICT_PARTICIPANT_FILTER)
    Slice<ChatConversationWithDerivedFields> searchConversationsOfCurrentUser(
            @Param("user") User currentUser,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @Query(SELECT_STATEMENT + """
            from ChatConversation conversation
            where :user in elements(conversation.participants) and exists (
                select message
                from ChatMessage message
                where message.conversation.id = conversation.id and message.id > :currentLatestMessageId
            ) and
            """ + PARTICIPANT_BLOCKS_EACH_OTHER_FILTER + " and " + RESTRICT_PARTICIPANT_FILTER + """
            order by
            """ + " (" + Constants.LATEST_MESSAGE_ID + ") DESC")
    List<ChatConversationWithDerivedFields> findAllConversationWithNewestMessage(
            @Param("user") User currentUser,
            @Param("currentLatestMessageId") Long currentLatestMessageId
    );

    @Query("""
            select count(*)
            from ChatConversation conversation join conversation.readStatuses readStatus
            where readStatus.readBy = :user and readStatus.latestMessagesRead = false
            and
            """ + RESTRICT_PARTICIPANT_FILTER)
    int countUnreadConversation(
            @Param("user") User currentUser
    );

    @Query("""
            select conversation
            from ChatConversation conversation join conversation.readStatuses readStatus
            where readStatus.readBy = :user and readStatus.latestMessagesRead = false
            and
            """ + PARTICIPANT_BLOCKS_EACH_OTHER_FILTER + " and " + RESTRICT_PARTICIPANT_FILTER)
    List<ChatConversation> findAllUnreadConversation(
            @Param("user") User currentUser
    );
}
