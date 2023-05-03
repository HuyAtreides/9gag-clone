import { DeleteOutlined, FormOutlined, UploadOutlined } from '@ant-design/icons';
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
import { Constant } from '../../../../models/enums/constant';
import { getCountryListOptions } from '../../../../models/enums/country';
import { UpdateProfileFormData } from '../../../../models/update-profile-form-data';
import styles from './UserAccountSettings.module.scss';

const UserAccountSettings: React.FC = () => {
  const user = useAppSelector((state) => state.user.profile);
  const [uploadFile, handleFileChange, setUploadFile] = useUploadFile(
    user?.getMediaLocation(),
  );
  const dispatch = useAppDispatch();
  const singleUploadFile = uploadFile && uploadFile[0];
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
      });
      setUploadFile([
        {
          uid: '0',
          name: '',
          url: user.getMediaLocation().url,
          type: user.getMediaLocation().type,
        },
      ]);
    }
  }, [form, setUploadFile, user]);

  useEffect(() => {
    form.setFieldValue('avatar', singleUploadFile);
  }, [singleUploadFile, form]);

  const handleRemoveAvatar = () => {
    setUploadFile(undefined);
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
          src={singleUploadFile ? singleUploadFile.url : Constant.DefaultUserAvatarUrl}
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
                onChange={handleFileChange}
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
        <Select placeholder='Select your country'>
          {getCountryListOptions().map((option) => (
            <Option value={option.value}>
              <NameWithCountryFlag name={option.label} country={option.value} />
            </Option>
          ))}
        </Select>
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
