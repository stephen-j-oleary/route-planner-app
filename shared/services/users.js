import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/users";


export async function getUsers(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params
  });

  return data;
}

export async function getUserById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export async function updateUserById(id, changes) {
  const { data } = await httpClient.request({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data: changes,
  });

  return data;
}

export async function deleteUserById(id) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}