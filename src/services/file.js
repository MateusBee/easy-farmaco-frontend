import { api } from 'services/api';

export const uploadFile = async (file) => {
    const url = "https://api.cloudinary.com/v1_1/demo/image/upload";

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "docs_upload_example_us_preset");
    formData.append("cloud_name","dd9mn3zj8");

    return await fetch(url, {
        method: "POST",
        body: formData
      })
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            return JSON.parse(data);
        })
};

export const getAll = () => api.get(`/file`);

export const createFile = (data) => api.post(`/file`, data);

export const deleteFile = (id) => api.delete(`/file/${id}`);