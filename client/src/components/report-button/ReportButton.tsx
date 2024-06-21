import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Menu, Modal, Typography } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useState } from 'react';
import { useAppDispatch } from '../../Store';
import { report } from '../../Store/user/user-dipatchers';
import { User } from '../../models/user';
import AuthenticatedGuard from '../component-guard/AuthenticatedGuard';
import styles from './ReportButton.module.css';

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

const reportProfileItems: ItemType[] = [
  { label: 'Fake Account', key: 'Fake Account' },
  { label: 'Fake Name', key: 'Fake Name' },
  { label: 'Inappropriate Post', key: 'Inappropriate Post' },
  { label: 'Harassment or Bullying', key: 'Harassment or Bullying' },
];

interface Props {
  readonly user: User;
  readonly reportProfile?: boolean;
}

const ReportButton = ({ user, reportProfile = false }: Props) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState<null | string>(null);

  const sendReport = async () => {
    if (!reason) {
      return;
    }
    setLoading(true);

    await dispatch(report(user.id, reason));
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
            onCancel={() => setShowModal(false)}
            onOk={sendReport}
            bodyStyle={{ padding: 10 }}
          >
            <Menu
              items={reportProfile ? reportProfileItems : items}
              onSelect={(selectedInfo) => setReason(selectedInfo.key)}
            />
          </Modal>
        </>
      }
    ></AuthenticatedGuard>
  );
};

export default ReportButton;
