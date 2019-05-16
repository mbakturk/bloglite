import  axios  from "axios";

const httpClient = axios.create({
    baseURL: "./",
    timeout: 30000
});

export default httpClient;