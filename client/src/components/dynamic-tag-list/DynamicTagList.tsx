import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Tag, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './DynamicTagList.module.scss';

type FormItemProps = {
  onChange?: (tags: string) => void;
};

const DynamicTagList: React.FC<FormItemProps> = ({ onChange }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const tagList = [...tags, inputValue];
      setTags(tagList);

      if (onChange) {
        onChange(tagList.join(','));
      }
    }

    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    return (
      <Tag
        closable
        onClose={(_) => {
          handleClose(tag);
        }}
        key={tag}
        className={styles.tag}
      >
        {tag}
      </Tag>
    );
  };

  return (
    <>
      <div className={styles.tagList}>{tags.map(forMap)}</div>
      {inputVisible && (
        <Input
          ref={inputRef}
          type='text'
          size='large'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          suffix={
            <Tooltip trigger='hover' title='Post tags will be used to search your post'>
              <InfoCircleOutlined />
            </Tooltip>
          }
        />
      )}
      {!inputVisible && (
        <Button type='dashed' onClick={showInput} icon={<PlusOutlined />}>
          New Tag
        </Button>
      )}
    </>
  );
};

export default DynamicTagList;
