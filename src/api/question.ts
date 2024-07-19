import { proxyHttp as http } from "@/utils/http/proxy";

/*type Result = {
  success: boolean;
  data: Array<any>;
};*/

export const getList = (query: any) => {
  return http.request<any>("get", "/questions", {
    params: query
  });
};

export const create = (data?: object) => {
  return http.request<any>("post", "/questions", { data });
};
/** 更新 */
export const update = (id: number, data: object) => {
  return http.request<any>("put", "/questions/" + id, { data });
};
export const destroy = (id: number, data?: object) => {
  return http.request<any>("delete", "/questions/" + id, { data });
};
