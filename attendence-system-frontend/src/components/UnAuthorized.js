import React from "react";

import "./UnAuthorized.css";

const UnAuthorized = () => {
  return (
    <div className="container">
      <h1 className="status">401</h1>
      <h1 className="unauthorize_title"> NOT AUTHORIZED!</h1>
      <p className="message">You are not authorized to view this page.</p>
    </div>
  );
};

export default UnAuthorized;
