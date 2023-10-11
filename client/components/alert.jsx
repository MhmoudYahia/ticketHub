import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const MyAlert = ({ severity, title, message }) => {
  return (
    <div className="alert">
      <Alert severity={severity}>
        {title && (
          <AlertTitle style={{ fontWeight: 800, textTransform: "uppercase" }}>
            {title}
          </AlertTitle>
        )}
        <div style={{ fontWeight: 900, textTransform: "capitalize" }}>
          {message}
        </div>
      </Alert>
    </div>
  );
};

export default MyAlert;
