import { useState, useEffect } from 'react';
import client from '../utils/httpClient';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    client
      .get(url)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  }, [refetch]);

  return { isPending, data, setData, error, setRefetch };
};
