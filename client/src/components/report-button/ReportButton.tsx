import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Menu, Modal, Typography } from 'antd';
import AuthenticatedGuard from '../component-guard/AuthenticatedGuard';
import { useState } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import Post from '../../models/post';
import { useAppDispatch } from '../../Store';
import { report } from '../../Store/user/user-dipatchers';

const items: ItemType[] = [
  { label: 'Spam', key: 'Spam' },
  { label: 'Pornography', key: 'Pornography' },
  { label: 'Hatred and bullying', key: 'Hatred and bullying' },
  {
    label: 'Copyright and trademark infringement',
    key: 'Copyright and trademark infringement',
  },
  {
    label: 'Violent, gory and harmful content',
    key: 'Violent, gory and harmful content',
  },
  { label: 'Deceptive content', key: 'Deceptive content' },
  { label: 'Illegal activities', key: 'Illegal activities' },
];

interface Props {
  readonly post: Post;
}

const ReportButton = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<null | string>(null);

  const sendReport = async () => {
    if (!post.user?.id || !reason) {
      return;
    }
    setLoading(true);

    await dispatch(report(post.user.id, reason));
    setShowModal(false);
    setLoading(false);
  };

  return (
    <AuthenticatedGuard
      component={
        <>
          <Button
            icon={<ExclamationCircleOutlined />}
            type='text'
            onClick={() => setShowModal(true)}
          >
            Report
          </Button>
          <Modal
            title={<Typography.Title level={3}>Report</Typography.Title>}
            visible={showModal}
            okText='Send'
            confirmLoading={loading}
            onOk={sendReport}
          >
            <Menu
              items={items}
              onSelect={(selectedInfo) => setReason(selectedInfo.key)}
            />
          </Modal>
        </>
      }
    ></AuthenticatedGuard>
  );
};

export default ReportButton;
