package com.huyphan.services.followactioninvoker;

import com.huyphan.models.User;
import com.huyphan.services.OwnedObject;
import java.util.Set;

public interface Followable extends OwnedObject {

    Set<User> getFollowers();
}
