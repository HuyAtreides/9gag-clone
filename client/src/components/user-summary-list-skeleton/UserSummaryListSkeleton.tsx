import { Skeleton } from 'antd';

const UserSummaryListSkeleton = () => {
  return (
    <>
      {Array.from(Array(3)).map((_, __) => (
        <>
          <Skeleton avatar paragraph={{ rows: 2 }} active />
          <br />
        </>
      ))}
    </>
  );
};

export default UserSummaryListSkeleton;
