import { UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { useEffect, useState } from 'react';
import MediaLocation from '../models/media-location';
import { generateVideoThumbnail } from '../utils/generate-video-thumbnail';

type ReturnType = [
  UploadFile[] | undefined,
  (info: UploadChangeParam<UploadFile<any>>) => void,
  React.Dispatch<React.SetStateAction<UploadFile<any>[] | undefined>>,
];

const useUploadFile = (media?: MediaLocation): ReturnType => {
  const [uploadFile, setUploadFile] = useState<UploadFile[] | undefined>();

  useEffect(() => {
    if (media) {
      (async function () {
        const thumbUrl = await generateVideoThumbnail(media);

        setUploadFile([
          {
            uid: '0',
            name: '',
            thumbUrl: thumbUrl,
            url: media.url,
          },
        ]);
      })();
    }
  }, [media]);

  const handleFileChange: (info: UploadChangeParam<UploadFile<any>>) => void = async (
    info,
  ) => {
    const fileList = info.fileList;
    let uploadFiles = undefined;

    if (fileList.length) {
      const thumbnailUrls = await Promise.all(
        fileList.map(async (file) => {
          const thumbnailUrl = generateVideoThumbnail(file.originFileObj!);
          return thumbnailUrl;
        }),
      );

      uploadFiles = fileList.map(
        (file, index): UploadFile => ({
          uid: file.uid,
          name: '',
          url: URL.createObjectURL(file.originFileObj!),
          thumbUrl: thumbnailUrls[index],
        }),
      );
    }

    if (info.file.status === 'removed' && info.file.url) {
      URL.revokeObjectURL(info.file.url);
    }

    setUploadFile(uploadFiles);
  };

  return [uploadFile, handleFileChange, setUploadFile];
};

export default useUploadFile;
