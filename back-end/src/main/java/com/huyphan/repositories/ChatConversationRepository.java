package com.huyphan.repositories;

import com.huyphan.models.ChatConversation;
import com.huyphan.models.ChatParticipant;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ChatConversationRepository extends CrudRepository<ChatConversation, Long> {

    @Query("""
            select case when (count(*) > 0) then true else false end
            from ChatConversation conversation
            where not exists (
                select user
                from User user
                where user in elements(conversation.participants) and user not in :participants
            )
            """)
    boolean exitsConversationWithParticipants(@Param("participants") List<ChatParticipant> participants);
}
