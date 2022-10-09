package com.huyphan.services;

import com.huyphan.models.exceptions.VoteableObjectException;
import java.util.Objects;
import java.util.Set;

public abstract class VoteableObjectManager<T> {

    public void addUpvotedObject(T object) throws VoteableObjectException {
        Set<T> upVotedObjects = getUpvotedObjects();
        Set<T> downVotedObjects = getDownvotedObjects();

        if (upVotedObjects.contains(object) || downVotedObjects.contains(object)) {
            throw new VoteableObjectException("Object was voted");
        }

        upVotedObjects.add(object);
    }

    public void addDownVotedObject(T object) throws VoteableObjectException {
        Set<T> upVotedObjects = getUpvotedObjects();
        Set<T> downVotedObjects = getDownvotedObjects();

        if (upVotedObjects.contains(object) || downVotedObjects.contains(object)) {
            throw new VoteableObjectException("Object was voted");
        }

        downVotedObjects.add(object);
    }


    public void removeUpvotedObject(T object) throws VoteableObjectException {
        boolean ifRemoved = getUpvotedObjects()
                .removeIf((votedPost) -> Objects.equals(votedPost, object));

        if (!ifRemoved) {
            throw new VoteableObjectException("Object wasn't voted");
        }

    }


    public void removeDownvotedObject(T object) throws VoteableObjectException {
        boolean ifRemoved = getDownvotedObjects()
                .removeIf((votedPost) -> Objects.equals(votedPost, object));

        if (!ifRemoved) {
            throw new VoteableObjectException("Object wasn't voted");
        }
    }

    abstract Set<T> getUpvotedObjects();

    abstract Set<T> getDownvotedObjects();
}
