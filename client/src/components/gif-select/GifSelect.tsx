import { GifOutlined, SearchOutlined } from '@ant-design/icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';
import { Button, Empty, Input, Modal, Spin } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { Constant, MediaType } from '../../models/enums/constant';
import MediaLocation from '../../models/media-location';
import styles from './GifSelect.module.css';

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIFPHY_API_KEY as string);

interface Props {
  setGif: (gif: MediaLocation) => void;
}

const GifSelect: React.FC<Props> = ({ setGif }: Props) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  const fetchGifs = (offset: number) => {
    if (offset === 0) {
      setIsFetching(true);
    }
    if (searchTerm) {
      return giphyFetch.search(searchTerm, { offset });
    }

    return giphyFetch.trending({ offset });
  };

  const onGifSelect = (gif: IGif) => {
    setOpen(false);

    setGif({
      type: MediaType.Gif,
      url: gif.id as string,
    });
  };

  return (
    <>
      <Button icon={<GifOutlined />} shape='default' onClick={() => setOpen(true)} />
      <Modal
        title='Select a GIF!'
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={window.innerWidth * 0.9}
      >
        <Input
          className={styles.searchInput}
          size='large'
          placeholder='Search...'
          onChange={handleSearch}
          prefix={<SearchOutlined />}
        />
        <Spin spinning={isFetching} size='large'>
          <div className={styles['gif-select-container']}>
            <Grid
              fetchGifs={fetchGifs}
              width={window.innerWidth * 0.8}
              columns={3}
              key={searchTerm}
              noLink
              onGifClick={onGifSelect}
              noResultsMessage={<Empty />}
              onGifVisible={() => setIsFetching(false)}
            />
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default GifSelect;
