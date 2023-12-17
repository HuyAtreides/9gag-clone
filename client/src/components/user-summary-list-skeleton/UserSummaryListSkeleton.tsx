import { Skeleton } from 'antd';

const UserSummaryListSkeleton = () => {
  return (
    <>
      {Array.from(Array(3)).map((_, index) => (
        <span key={index}>
          <Skeleton avatar paragraph={{ rows: 2 }} active />
          <br />
        </span>
      ))}
    </>
  );
};

export default UserSummaryListSkeleton;
