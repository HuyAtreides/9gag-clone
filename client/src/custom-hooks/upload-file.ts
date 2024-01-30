import { UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { useEffect, useState } from 'react';
import { MediaType } from '../models/enums/constant';
import MediaLocation from '../models/media-location';
import { generateVideoThumbnail } from '../utils/generate-video-thumbnail';
import { isFileType } from '../utils/mime-type';

type ReturnType = [
  UploadFile[] | undefined,
  (info: UploadChangeParam<UploadFile<any>>) => void,
  React.Dispatch<React.SetStateAction<UploadFile<any>[] | undefined>>,
];

const useUploadFile = (media?: MediaLocation): ReturnType => {
  const [uploadFile, setUploadFile] = useState<UploadFile[] | undefined>();

  useEffect(() => {
    if (media && media.type !== MediaType.Gif) {
      (async function () {
        const thumbUrl = await generateVideoThumbnail(media);

        setUploadFile([
          {
            uid: '0',
            name: media.type === MediaType.File ? media.originalFileName || '' : '',
            thumbUrl: thumbUrl,
            url: media.url,
            type: media.type,
          },
        ]);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      uploadFiles = fileList.map((file, index): UploadFile => {
        const isFile = isFileType(file?.originFileObj?.type);

        return {
          uid: file.uid,
          name: isFile ? file.originFileObj?.name || '' : '',
          url: URL.createObjectURL(file.originFileObj!),
          thumbUrl: thumbnailUrls[index],
          type: file.originFileObj?.type,
          originFileObj: file.originFileObj,
        };
      });
    }

    if (info.file.status === 'removed' && info.file.url) {
      URL.revokeObjectURL(info.file.url);
    }

    setUploadFile(uploadFiles);
  };

  return [uploadFile, handleFileChange, setUploadFile];
};

export default useUploadFile;
