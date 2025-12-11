import axios from "axios";

const API_URL = "http://localhost:4000/api";

export async function fetchAutos() {
    const res = await axios.get(`${API_URL}/autos`);
    return res.data;
}

export async function createAuto(data) {
    const res = await axios.post(`${API_URL}/autos`, data);
    return res.data;
}

export async function updateAuto(id, data) {
    const res = await axios.put(`${API_URL}/autos/${id}`, data);
    return res.data;
}

export async function deleteAuto(id) {
    const res = await axios.delete(`${API_URL}/autos/${id}`);
    return res.data;
}

export async function uploadFoto(file) {
    const formData = new FormData();
    formData.append("foto", file);

    const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data; // { url: "/uploads/..." }
}
