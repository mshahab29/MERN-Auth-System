import { useEffect, useRef } from "react";

const GoogleLoginButton = ({ onSuccess }) => {
  const googleButtonRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Identity Services is not loaded");
      return;
    }

    if (!googleButtonRef.current) {
      return;
    }
    // Prevent Google from being initialized more than once
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: (response) => {
        onSuccess(response.credential);
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: 300,
    });
  }, [onSuccess]);

  return <div ref={googleButtonRef}></div>;
};

export default GoogleLoginButton;
