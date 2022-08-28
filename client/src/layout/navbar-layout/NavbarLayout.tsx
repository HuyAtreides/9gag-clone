import { Avatar, Button, Popover, Typography } from "antd";
import {
    MenuOutlined,
    SearchOutlined,
    UserOutlined,
    EditFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useProtectedAction from "../../custom-hooks/protected-action";
import { useAppSelector } from "../../Store";
import styles from "./Navbar.module.scss";

interface INavbarLayout {
    collapse: boolean;
    setCollapse: (value: boolean) => void;
}

/** Common layout for other features. */
const NavbarLayout: React.FC<INavbarLayout> = ({ collapse, setCollapse }) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.profile);
    const protectAction = useProtectedAction();

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.itemContainer}>
                <Button
                    shape="circle"
                    icon={<MenuOutlined />}
                    className={styles.iconCollapse}
                    onClick={() => setCollapse(!collapse)}
                />
                <Typography.Title className={styles.logo}>
                    9GAP
                </Typography.Title>
            </div>
            <div className={styles.itemContainer}>
                <Button
                    shape="circle"
                    icon={<SearchOutlined />}
                    className={styles.iconCollapse}
                />
                <Typography.Text
                    className={styles.text}
                    onClick={protectAction(() => console.log("Authenticated"))}
                >
                    {user ? user.displayName : "Sign up/Log in"}
                </Typography.Text>
                <Popover placement="bottom" trigger="click" content={<Typography.Text>Log out</Typography.Text>}>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ margin: "0 20px" }}
                        src={user?.avatarUrl}
                    />
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
