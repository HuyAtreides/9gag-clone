import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { debounce } from 'lodash';
import { useCallback } from 'react';

import { useAppDispatch } from '../../../../Store';
import { setSearchTerm } from '../../../../Store/post/post-slice';
import AutoClosePopover from '../../../../components/auto-close-popover/AutoClosePopover';
import { Constant } from '../../../../models/enums/constant';
import styles from './PostSearch.module.scss';

const PostSearch: React.FC = () => {
  const dispatch = useAppDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  return (
    <AutoClosePopover
      closeAfterClicked={false}
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
    </AutoClosePopover>
  );
};

export default PostSearch;
