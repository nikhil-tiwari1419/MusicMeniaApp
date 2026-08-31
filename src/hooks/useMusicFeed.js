import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMusicPage } from '../api/music.api';

export function useMusicFeed(limit = 10) {
    return useInfiniteQuery({
        queryKey: ['music-feed'],
        queryFn: ({ pageParam = 1 }) => fetchMusicPage({ pageParam, limit }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination || {};
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
}

