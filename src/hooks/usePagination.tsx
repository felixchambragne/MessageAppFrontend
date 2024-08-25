import {useState} from 'react';

interface PaginationProps {
  fetchData: () => void;
  initialLimit: number;
}

export function usePagination({fetchData, initialLimit}: PaginationProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(initialLimit);

  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      fetchData();
      setOffset(prevOffset => prevOffset + limit);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  return {
    loading,
    setLoading,
    error,
    hasMore,
    setHasMore,
    offset,
    setOffset,
    limit,
    loadMore,
  };
}
