import { Alert, AlertTitle } from '@mui/material';
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
      setErrors(
        <Alert severity="error">
          <AlertTitle>Ooopps...</AlertTitle>
          <ul className="my-0">
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </Alert>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
