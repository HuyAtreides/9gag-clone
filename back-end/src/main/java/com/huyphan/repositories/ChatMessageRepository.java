package com.huyphan.repositories;

import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.User;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, Long> {

    String CONVERSATION_DELETE_DATE = """
                (
                    select case when (count(*) > 0) then max(record.deleteAt) else '1999-01-01' end
                    from ChatConversation conversation inner join conversation.deleteRecords record
                    where record.deleteBy = :user and conversation = chatMessage.conversation
                )
            """;

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
             and :user in elements(chatMessage.conversation.participants)
             and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE)
    Slice<ChatMessage> getConversationChatMessages(
            @Param("user") User user,
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
             and :user in elements(chatMessage.conversation.participants)
             and lower(chatMessage.content.text) like :searchTerm
             and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE)
    Slice<ChatMessage> searchConversationChatMessages(
            @Param("user") User user,
            @Param("searchTerm") String searchTerm,
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id <= :latestMessageId and chatMessage.id >= :oldestMessageId
            and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE +
            """
            order by chatMessage.sentDate DESC
            """)
    List<ChatMessage> findAllChatMessagesInRange(
            @Param("user") User user,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
            and chatMessage.id <= :latestMessageId and chatMessage.id >= :oldestMessageId
            and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE +
            """
            order by chatMessage.sentDate DESC
            """)
    List<ChatMessage> findConversationChatMessagesInRange(
            @Param("user") User user,
            @Param("conversation") ChatConversation conversation,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation and chatMessage.pinned = true
            and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE)
    Slice<ChatMessage> findAllPinnedMessages(
            @Param("user") User user,
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id >= :latestMessageId
            and chatMessage.sentDate > """ + CONVERSATION_DELETE_DATE)
    List<ChatMessage> findAllLatestChatMessages(
            @Param("user") User user,
            @Param("latestMessageId") Long latestMessageId
    );
}
