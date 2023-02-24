import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popover } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

import { Constant } from '../../../../models/enums/constant';
import { useAppDispatch } from '../../../../Store';
import { setSearchTerm } from '../../../../Store/post/post-slice';
import styles from './PostSearch.module.scss';

const PostSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showSearch, setShowSearch] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
      setShowSearch(false);
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  return (
    <Popover
      placement='bottom'
      trigger='click'
      onVisibleChange={(visible) => setShowSearch(visible)}
      visible={showSearch}
      content={
        <div className={styles.searchContainer}>
          <Input
            className={styles.searchInput}
            bordered={false}
            size='large'
            placeholder='Search...'
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
        </div>
      }
    >
      <Button shape='circle' icon={<SearchOutlined />} className={styles.iconCollapse} />
    </Popover>
  );
};

export default PostSearch;
