import axios from "axios";

export const limsClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: "application/json",
    },
});

export const limsImageHostClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_IMAGE_HOST_URL,
    responseType: "arraybuffer",
});
