import {
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Select,
  Typography,
  Upload,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Option } from 'antd/lib/mentions';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../Store';
import { updateProfile } from '../../../../Store/user/user-dipatchers';
import { setUserErrorMessage } from '../../../../Store/user/user-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import NameWithCountryFlag from '../../../../components/name-with-country-flag/NameWithCountryFlag';
import useRenderErrorMessage from '../../../../custom-hooks/render-error-message';
import useUploadFile from '../../../../custom-hooks/upload-file';
import { getCountryListOptions } from '../../../../models/enums/country';
import { UpdateProfileFormData } from '../../../../models/update-profile-form-data';
import styles from './UserAccountSettings.module.scss';
import TextArea from 'antd/lib/input/TextArea';

const UserAccountSettings: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);
  const [uploadAvatar, handleAvatarChange, setUploadAvatar] = useUploadFile(
    user?.getAvatarLocation(),
  );
  const [uploadCoverImg, handleCoverImgChange, setUploadCoverImg] = useUploadFile(
    user?.getCoverImgLocation(),
  );
  const dispatch = useAppDispatch();
  const avatar = uploadAvatar && uploadAvatar[0];
  const coverImg = uploadCoverImg && uploadCoverImg[0];
  const isUpdating = useAppSelector((state) => state.user.isUpdating);
  const [form] = useForm<UpdateProfileFormData>();
  const errorMessage = useAppSelector((state) => state.user.errorMessage);

  useRenderErrorMessage(errorMessage, setUserErrorMessage);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        displayName: user.displayName,
        country: user.country,
        isPrivate: user.isPrivate,
        about: user.about,
      });
      setUploadAvatar([
        {
          uid: '0',
          name: '',
          url: user.getAvatarLocation().url,
          type: user.getAvatarLocation().type,
        },
      ]);
      setUploadCoverImg([
        {
          uid: '1',
          name: '',
          url: user.getCoverImgLocation().url,
        },
      ]);
    }
  }, [form, setUploadAvatar, user, setUploadCoverImg]);

  useEffect(() => {
    form.setFieldValue('avatar', avatar);
    form.setFieldValue('coverImg', coverImg);
  }, [avatar, form, coverImg]);

  const handleRemoveAvatar = () => {
    setUploadAvatar(undefined);
  };

  const handleUpdateProfile = (values: UpdateProfileFormData) => {
    dispatch(updateProfile(values));
  };

  return (
    <Form
      layout='vertical'
      disabled={isUpdating}
      form={form}
      onFinish={handleUpdateProfile}
    >
      <Typography.Title level={3}>Profile</Typography.Title>
      <Divider />
      <Form.Item name='avatar' label={<strong>Avatar</strong>}>
        <Image
          src={avatar ? avatar.url : (process.env.REACT_APP_DEFAULT_AVATAR_URL as string)}
          alt='user avatar'
          className={styles.avatar}
        />
        <AutoClosePopover
          content={
            <>
              <Upload
                name='avatar'
                maxCount={1}
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button type='text' icon={<UploadOutlined />}>
                  Upload Photo
                </Button>
              </Upload>

              <Button
                type='text'
                icon={<DeleteOutlined />}
                onClick={handleRemoveAvatar}
                danger
              >
                Remove Photo
              </Button>
            </>
          }
        >
          <Button className={styles.editButton} icon={<FormOutlined />}>
            Edit
          </Button>
        </AutoClosePopover>
      </Form.Item>
      <Form.Item
        name='username'
        rules={[
          {
            required: true,
            message: 'Please enter your username!',
          },
          {
            pattern: /^[a-zA-Z_0-9-]{1,20}$/,
            message:
              'Username should contain only numbers, alphabet letters, _, - and has at most 20 characters',
          },
        ]}
        label={<strong>Username</strong>}
        extra='This is the name that will show up on your posts and comments'
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please enter your display name!',
          },
        ]}
        name='displayName'
        label={<strong>Display Name</strong>}
        extra='This is the name that will be visible on your profile'
      >
        <Input />
      </Form.Item>
      <Form.Item label={<strong>Country</strong>} name='country'>
        <Select placeholder='Select your country' allowClear>
          {getCountryListOptions().map((option) => (
            <Option value={option.value}>
              <NameWithCountryFlag name={option.label} country={option.value} />
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={<strong>About (Optional)</strong>}
        name='about'
        extra='A brief description of yourself shown on your profile.'
      >
        <TextArea allowClear />
      </Form.Item>

      <Form.Item name='coverImg' label={<strong>Cover Image</strong>}>
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          fileList={uploadCoverImg}
          onChange={handleCoverImgChange}
          listType='picture-card'
        >
          <div>
            <PlusOutlined />
            <p>Upload</p>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name='isPrivate'
        valuePropName='checked'
        extra='When your account is public, your profile and posts can be seen by anyone.
When your account is private, only the followers you approve can see your posts and your followers and following lists. '
      >
        <Checkbox>Account Private</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' block loading={isUpdating}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserAccountSettings;
