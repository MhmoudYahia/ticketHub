import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    setErrors(null);
    try {
      const Response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(Response.data);
      }
      return Response.data;
    } catch (error) {
      console.log(
        error
      );
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooopps...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
