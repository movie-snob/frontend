import request from "../utils/request";

export const fetchStats = async () => {
  return request({
    url: "/stats",
    method: "get",
  });
};
