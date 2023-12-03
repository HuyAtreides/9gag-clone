import { DebouncedFunc, debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { Constant } from '../models/enums/constant';

const useDebounceSearch = (): [
  string | null,
  DebouncedFunc<(e: React.ChangeEvent<HTMLInputElement>) => void>,
] => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.trim();
      setSearchTerm(searchTerm.length === 0 ? null : searchTerm);
    }, Constant.DebounceTimeInMiliSeconds),
    [],
  );

  return [searchTerm, handleSearch];
};

export default useDebounceSearch;
