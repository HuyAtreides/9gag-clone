package com.huyphan.services;

import com.huyphan.models.exceptions.VoteableObjectException;
import java.util.Objects;
import java.util.Set;

public abstract class VoteableObjectManager<T> {

    public void addUpvotedObject(T object) throws VoteableObjectException {
        Set<T> upVotedObjects = getUpvotedObjects();
        Set<T> downVotedObjects = getDownvotedObjects();

        if (upVotedObjects.contains(object)) {
            throw new VoteableObjectException("Object was voted");
        }

        upVotedObjects.add(object);
    }

    public void addDownVotedObject(T object) throws VoteableObjectException {
        Set<T> upVotedObjects = getUpvotedObjects();
        Set<T> downVotedObjects = getDownvotedObjects();

        if (downVotedObjects.contains(object)) {
            throw new VoteableObjectException("Object was voted");
        }

        downVotedObjects.add(object);
    }


    public boolean removeUpvotedObject(T object) throws VoteableObjectException {
        return getUpvotedObjects()
                .removeIf((votedPost) -> Objects.equals(votedPost, object));


    }


    public boolean removeDownvotedObject(T object) throws VoteableObjectException {

        return getDownvotedObjects()
                .removeIf((votedPost) -> Objects.equals(votedPost, object));
    }

    abstract Set<T> getUpvotedObjects();

    abstract Set<T> getDownvotedObjects();
}
