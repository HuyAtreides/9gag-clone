package com.huyphan.repositories;

import com.huyphan.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {

    @EntityGraph("UserEntityGraph")
    User findByUsername(String username);
}
