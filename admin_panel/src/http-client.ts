import  axios  from "axios";

const httpClient = axios.create({
    baseURL: "./",
    timeout: 1000
});

export default httpClient;