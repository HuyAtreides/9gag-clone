package com.huyphan.mediators;

import com.huyphan.events.AppEvent;
import com.huyphan.models.exceptions.AppException;

public interface IMediator {

    void notify(AppEvent appEvent) throws AppException;
}
