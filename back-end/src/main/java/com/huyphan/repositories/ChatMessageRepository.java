package com.huyphan.repositories;

import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
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
            """)
    List<ChatMessage> findAllPossiblyUpdatedChatMessages(
            @Param("user") User user,
            @Param("oldestMessageId") Long oldestMessageId,
            @Param("latestMessageId") Long latestMessageId
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
