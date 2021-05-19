import React, { useState } from "react";

const PopupScreen = () => {
  const [state, setstate] = useState("");
  const update = (e) => {
    setstate(e.target.value);
    window.opener.onSuccess(state);
  };
  return (
    <>
      <input value={state} onChange={update} />
      <button
        onClick={() => {
          window.close();
        }}
      >
        Close Me
      </button>
    </>
  );
};

export default PopupScreen;
