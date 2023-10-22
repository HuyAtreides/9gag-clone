package com.huyphan.repositories;

import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatMessage;
import com.huyphan.models.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
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
            where chatMessage.id >= :latestId and :user in elements(chatMessage.conversation.participants)
            """)
    List<ChatMessage> findLatestChatMessage(
            @Param("user") User user,
            @Param("latestId") Long latestId
    );

    @EntityGraph("ChatMessageWithConversationInfo")
    @Query("""
            select chatMessage
            from ChatMessage chatMessage
            where chatMessage.conversation.id = :conversationId
             and :user in elements(chatMessage.conversation.participants)
             """)
    Slice<ChatMessage> getConversationChatMessages(
            @Param("user") User user,
            @Param("conversationId") Long conversationId
    );

    @Query("""
            select conversation
            from ChatConversation conversation
            where conversation.id = :conversationId and :user in elements(conversation.participants)
            """)
    Optional<ChatConversation> getConversation(
            @Param("user") User user,
            @Param("conversationId") Long conversationId
    );


}
