import axios from 'axios';

const buildClient = ({ req }) => {  
  if (typeof window === 'undefined') {
    // server
    return axios.create({
      headers: req.headers, // cookie and host from the request from browser
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    });
  } else {
    //  browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
