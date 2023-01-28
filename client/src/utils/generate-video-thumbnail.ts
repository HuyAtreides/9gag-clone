import { MediaType } from '../models/enums/constant';
import MediaLocation from '../models/media-location';

//https://stackoverflow.com/questions/23640869/create-thumbnail-from-video-file-via-file-input
export const generateVideoThumbnail = (file: File | MediaLocation) => {
  if (getMediaType(file) !== MediaType.Video) {
    return Promise.resolve(getObjectUrl(file));
  }

  return new Promise<string>((resolve) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = getObjectUrl(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL('image/png'));
    };
  });
};

function getObjectUrl(object: File | MediaLocation) {
  if (object instanceof File) {
    return URL.createObjectURL(object);
  }

  return object.url;
}

function getMediaType(media: File | MediaLocation) {
  if (media instanceof File) {
    return media.type.split('/')[0];
  }

  return media.type;
}
