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
            where chatMessage.conversation.id = :conversationId
             and :user in elements(chatMessage.conversation.participants)
             """)
    Slice<ChatMessage> getConversationChatMessages(
            @Param("user") User user,
            @Param("conversationId") Long conversationId,
            Pageable pageable
    );

    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id <= :latestMessageId and chatMessage.id >= :oldestMessageId
            order by chatMessage.sentDate DESC
            """)
    List<ChatMessage> findAllChatMessagesInRange(
            @Param("user") User user,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
    );

    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
            and chatMessage.id <= :latestMessageId and chatMessage.id >= :oldestMessageId
            order by chatMessage.sentDate DESC
            """)
    List<ChatMessage> findConversationChatMessagesInRange(
            @Param("conversation") ChatConversation conversation,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
    );

    @Query("""
            select min(chatMessage.id)
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation
            """)
    Integer getConversationOldestMessageId(
            @Param("conversation") ChatConversation conversation
    );

    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation = :conversation and chatMessage.pinned = true
            """)
    Slice<ChatMessage> findAllPinnedMessages(
            @Param("conversation") ChatConversation conversation,
            Pageable pageable
    );

    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where :user in elements(chatMessage.conversation.participants)
            and chatMessage.id >= :latestMessageId
            """)
    List<ChatMessage> findAllLatestChatMessages(
            @Param("user") User user,
            @Param("latestMessageId") Long latestMessageId
    );
}
