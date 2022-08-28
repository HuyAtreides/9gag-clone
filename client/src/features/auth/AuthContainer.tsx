import React, { useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import useRemoveErrorWhenUnmount from "../../custom-hooks/remove-error";
import useRenderErrorMessage from "../../custom-hooks/render-error-message";
import { useAppDispatch, useAppSelector } from "../../Store";
import {
    setAuthErrorMessage,
    setIsProtectedActionInvoked,
} from "../../Store/auth/auth-slice";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import styles from "./AuthContainer.module.scss";

/** Used by other features to display login or sign up form when an action
 * which requires authentication performed by unauthenticated user.
 * */
const AuthContainer: React.FC = () => {
    const [state, setState] = useState<string>('register');
    const authErrorMessage = useAppSelector((state) => state.auth.errorMessage);
    const dispatch = useAppDispatch();
    const isProtectedActionInvoked = useAppSelector(
        (state) => state.auth.isProtectedActionInvoked
    );

    useRenderErrorMessage(authErrorMessage, setAuthErrorMessage);
    useRemoveErrorWhenUnmount(setAuthErrorMessage);

    const handleCancel = () => {
        dispatch(setIsProtectedActionInvoked(false));
    };

    return (
        <Modal
            centered
            visible={isProtectedActionInvoked}
            onCancel={handleCancel}
            footer={null}
        >
            {state == 'register' ? <Register onNavigate={setState}/> : <Login onNavigate={setState}/>}
        </Modal>
    );
};

export default AuthContainer;
