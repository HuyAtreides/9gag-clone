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

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
             and :user in elements(chatMessage.conversation.participants)
             and chatMessage.sentDate > chatMessage.conversation.deleteAt
             """)
    Slice<ChatMessage> getConversationChatMessages(
            @Param("user") User user,
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id <= :latestMessageId and chatMessage.id >= :oldestMessageId
            and chatMessage.sentDate > chatMessage.conversation.deleteAt
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
            and chatMessage.sentDate > chatMessage.conversation.deleteAt
            order by chatMessage.sentDate DESC
            """)
    List<ChatMessage> findConversationChatMessagesInRange(
            @Param("conversation") ChatConversation conversation,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation and chatMessage.pinned = true
            and chatMessage.sentDate > chatMessage.conversation.deleteAt
            """)
    Slice<ChatMessage> findAllPinnedMessages(
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id >= :latestMessageId
            and chatMessage.sentDate > chatMessage.conversation.deleteAt
            """)
    List<ChatMessage> findAllLatestChatMessages(
            @Param("user") User user,
            @Param("latestMessageId") Long latestMessageId
    );
}
