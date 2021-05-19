import React from "react";
import PropTypes from "prop-types";

let browser = window;
let popup = null;
let timer = null;

function watcher() {
  if (popup === null) {
    clearInterval(timer);
    timer = null;
  } else if (popup !== null && !popup.closed) {
    popup.focus();
  } else if (popup !== null && popup.closed) {
    clearInterval(timer);
    browser.focus();
    browser.onClose("popupClosed");
    timer = null;
    popup = null;
  }
}

const WindowOpener = ({
  popupResponseHandler,
  children,
  name,
  url,
  opts,
  className,
}) => {
  browser = window.self;

  browser.onSuccess = (res) => {
    popupResponseHandler(null, res);
  };

  browser.onError = (error) => {
    popupResponseHandler(error);
  };

  browser.onOpen = (message) => {
    popupResponseHandler(null, message);
  };

  browser.onClose = (message) => {
    popupResponseHandler(null, message);
  };

  const onClickHandler = (e) => {
    if (popup && !popup.closed) {
      popup.focus();

      return;
    }

    popup = browser.open(url, name, opts);

    setTimeout(() => {
      popup.opener.onOpen("popupOpened");
    }, 0);

    if (timer === null) {
      timer = setInterval(watcher, 0);
    }

    return;
  };

  return (
    <div className={className} onClick={onClickHandler}>
      {children}
    </div>
  );
};

export default WindowOpener;

WindowOpener.propTypes = {
  url: PropTypes.string.isRequired,
  popupResponseHandler: PropTypes.func.isRequired,
  name: PropTypes.string,
  opts: PropTypes.string,
};
WindowOpener.defaultProps = {
  name: "Cool popup",
  opts: `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=${400}, height=${600}`,
};
