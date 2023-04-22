import { useMemo } from 'react';
import { timeDiffFromToday } from '../utils/time-diff';

const useTimeDiffFromToday = (date: Date) => {
  const timeDiff = useMemo<string>(() => timeDiffFromToday(date), [date]);

  return timeDiff;
};

export default useTimeDiffFromToday;
