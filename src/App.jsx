import { useEffect, useState } from "react";
import { redirectToSpotifyAuthorize } from "./utils/SpotifyRedirect";
import { getToken } from "./utils/Tokens";

const onConnect = async () => {
  redirectToSpotifyAuthorize();
};

function App() {
  // state to hold app connection status "loggedOut" | "loading" | "loggedIn" | "error"`
  const [authStatus, setAuthStatus] = useState("loggedOut");
  const [errorMessage, setErrorMessage] = useState();

 
  const handleAuthCallback = (code) => {
    setAuthStatus("loading");
    getToken(code)    
      .then(() => setAuthStatus("loggedIn"))
      // remove code verifier from sessionStorage
      .then(() => sessionStorage.clear())
      .catch((err) => {
        setAuthStatus("error");
        setErrorMessage(err.message);
      });
  };

  useEffect(() => {
    //stored the contents of broswe search bar to urlParams
    const urlParams = new URLSearchParams(window.location.search);
    //IF urlParms has code
    if (urlParams.has("code")) {
      //save code to code variable
      let code = urlParams.get("code");
 
      // Strip ?code=... and return to / — prevents re-reading a stale code
      // on refresh; replaceState avoids a full page reload.
      window.history.replaceState({}, document.title, "/");
      // handleAuthCallback isn't async and only ever fires once, from the
      // mount-only effect above — no cascading render risk, safe to suppress.
      // *** next line supresses linter error
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleAuthCallback(code);
    }
  }, []); //run once no dependency

  return (
    <div className="flex justify-center pt-32">
      {/* state "loggedOut" — show connect button only */}
      {authStatus === "loggedOut" && (
        <button
          onClick={() => {
            onConnect();
          }}
          className="bg-[#22C55E] text-[#064E1E] text-sm font-semibold px-8 py-2.5 rounded-full cursor-pointer"
        >
          Connect to Spotify
        </button>
      )}

      {/* state "loading" — show connecting to spotify message */}
      {authStatus === "loading" && (
        <p className="text-[#F8FAFC] text-[15px] font-medium leading-relaxed">
          Connecting to Spotify...
        </p>
      )}

      {/* state "loggedIn" — placeholder until user data/playlists are built */}
      {authStatus === "loggedIn" && (
        <p className="text-[#F8FAFC] text-[15px] font-medium leading-relaxed">
          Logged in — Spotify data coming soon
        </p>
      )}

      {/* state "error" — show captured error message */}
      {authStatus === "error" && (
        <p className="text-[#EF4444] text-[15px] font-medium leading-relaxed">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default App;
