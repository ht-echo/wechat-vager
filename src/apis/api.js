import req from "@/utils/request.js";

export const getUser = (params) => req.get("/user", params);
export const getUserRepos = (params) => req.get("/user/repos", params);
export const getUserStarred = (params) => req.get(`/users/${params}/starred`);
export const getCode = (params, token) =>
  req.get(
    `/repos/${params.owner}/${params.repo}/git/trees/${params.sha}`,
    token
  );
export const getBlob = (params, token) =>
  req.get(
    `/repos/${params.owner}/${params.repo}/git/blobs/${params.sha}`,
    token
  );
