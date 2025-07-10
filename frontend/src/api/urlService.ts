import api from "./axios";

export const fetchUrls = () => api.get("/urls");

export const createUrl = (link: string) =>
  api.post("/urls", { Link: link });

export const deleteUrl = (id: number) =>
  api.delete(`/urls/${id}`);

export const bulkDelete = (ids: number[]) =>
  Promise.all(ids.map((id) => deleteUrl(id)));
