import { ComputedConstants } from '../models/enums/constant';

export const handleInfiniteScroll = (
  callback: (...args: any[]) => void,
  ...callbackARgs: any[]
) => {
  return (event: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop >=
      ComputedConstants.ScreenHeight
    ) {
      callback(...callbackARgs);
    }
  };
};
