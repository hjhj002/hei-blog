import { createAlova } from 'alova';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';

export const alova = createAlova({
  baseURL: '/api',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  responded: async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },
});
