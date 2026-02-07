import { API } from "./client";
import { endpoints } from "./endpoints";

export const GamePointAPI = {
  getPointsIn: async (payload) => {
    const res = await API.post(endpoints.getPointsIn, payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return res.data;
  },

  getPointsOut: async (payload) => {
    const res = await API.post(endpoints.getPointsOut, payload,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return res.data;
  },
};


 