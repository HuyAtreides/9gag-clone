package com.huyphan.services.togglenotificationinvoker;

import com.huyphan.services.OwnedObject;

public interface Notifiable extends OwnedObject {

    void setNotificationEnabled(boolean value);
}
