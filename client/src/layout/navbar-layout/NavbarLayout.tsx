import { Avatar, Button, Input, Popover, Typography } from "antd";
import {
    MenuOutlined,
    SearchOutlined,
    UserOutlined,
    EditFilled,
    BellFilled
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import useProtectedAction from "../../custom-hooks/protected-action";
import { useAppDispatch, useAppSelector } from "../../Store";
import { logout } from "../../Store/auth/auth-dispatchers";
import DropdownMenu from "./components/DropdownMenu";
import styles from "./Navbar.module.scss";
import { useState } from "react";

interface INavbarLayout {
    collapse: boolean;
    setCollapse: (value: boolean) => void;
}

/** Common layout for other features. */
const NavbarLayout: React.FC<INavbarLayout> = ({ collapse, setCollapse }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.profile);
    const protectAction = useProtectedAction();
    const [visible, setVisible] = useState<boolean>(false);

    const handlerLogout = () => {
        dispatch(logout());
    };

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.itemContainer}>
                <Button
                    shape="circle"
                    icon={<MenuOutlined />}
                    className={styles.iconCollapse}
                    onClick={() => setCollapse(!collapse)}
                />
                <Link to="./" className={styles.logo}>
                    9GAP
                </Link>
            </div>
            <div className={styles.itemContainer}>
                <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                        <div className={styles.searchContainer}>
                            <Input
                                className={styles.searchInput}
                                bordered={false}
                                size="large"
                                placeholder="Search..."
                                onPressEnter={(e) => console.log(e.currentTarget.value)}
                                prefix={
                                    <SearchOutlined />
                                }
                            />
                        </div>
                    }
                >
                    <Button
                        shape="circle"
                        icon={<SearchOutlined />}
                        className={styles.iconCollapse}
                    />
                </Popover>
                <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                        <div className={styles.notifyContainer}>
                        </div>
                    }
                >
                    <Button
                        shape="circle"
                        icon={<BellFilled />}
                        className={styles.iconCollapse}
                    />
                </Popover>
                <Typography.Text
                    className={styles.text}
                    onClick={protectAction(() => console.log("Authenticated"))}
                >
                    {user ? user.displayName : "Sign up/Log in"}
                </Typography.Text>
                <Popover
                    placement="bottom"
                    trigger="click"
                    visible={visible}
                    content={
                        <div className={styles.navbarDropdown}>
                            {user ? (
                                <button
                                    className={styles.btnDropdown}
                                    onClick={() => {
                                        setVisible(false);
                                        handlerLogout();
                                    }}
                                >
                                    Log out
                                </button>
                            ) : (
                                ""
                            )}
                            <a className={styles.btnDropdown} href='https://about.9gag.com/app' target="_blank">Download 9GAG app</a>
                            <a className={styles.btnDropdown} href='https://9gag.helpshift.com/hc/en/' target="_blank">Help center</a>
                            <a className={styles.btnDropdown} href='https://9gag.helpshift.com/hc/en/3-9gag/contact-us/' target="_blank">Report problems</a>
                            <DropdownMenu setVisible={setVisible} />
                        </div>
                    }
                >
                    <Button
                        className={styles.avatar}
                        shape="circle"
                        onClick={() => setVisible(!visible)}
                    >
                        <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                    </Button>
                </Popover>
                <Button
                    onClick={protectAction(() => navigate("../post"))}
                    type="primary"
                    icon={<EditFilled />}
                    className={styles.btnPost}
                >
                    Post
                </Button>
            </div>
        </div>
    );
};

export default NavbarLayout;
