import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-project-d9465.firebaseio.com/'
});

export default instance;

