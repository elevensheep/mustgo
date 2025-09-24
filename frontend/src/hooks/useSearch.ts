import { useState, useCallback } from 'react';

interface UseSearchOptions {
  debounceMs?: number;
  minLength?: number;
}

function useSearch<T>(
  items: T[],
  searchFn: (items: T[], query: string) => T[],
  options: UseSearchOptions = {}
) {
  const { minLength = 0 } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>(items);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < minLength) {
      setResults(items);
      return;
    }

    const filteredResults = searchFn(items, searchQuery);
    setResults(filteredResults);
  }, [items, searchFn, minLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(items);
  }, [items]);

  return {
    query,
    results,
    handleSearch,
    clearSearch,
    isSearching: query.length > 0
  };
}

export default useSearch;
