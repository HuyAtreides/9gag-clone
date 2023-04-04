package com.huyphan.services.togglesendnotificationsinvoker;

import com.huyphan.services.OwnedObject;

public interface ToggleableSendNotifications extends OwnedObject {

    void setNotificationEnabled(boolean value);
}
