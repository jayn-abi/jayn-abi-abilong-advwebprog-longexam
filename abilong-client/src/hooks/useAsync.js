import { useEffect, useState } from 'react';

export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  useEffect(() => {
    let cancelled = false;

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
