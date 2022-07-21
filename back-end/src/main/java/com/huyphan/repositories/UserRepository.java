package com.huyphan.repositories;

import com.huyphan.models.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {

    @EntityGraph("UserEntityGraph")
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
