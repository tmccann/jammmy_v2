import { useEffect } from "react";
import { redirectToSpotifyAuthorize } from "./utils/SpotifyRedirect";

const onConnect = async () => {
  redirectToSpotifyAuthorize();
};

function App() {
  // state to hold app connection status "loggedOut" | "loading" | "loggedIn" | "error"`
  const [authStatus, setAuthStatus] = useState("loggedOut");
  useEffect(() => {
    //stored the contents of broswe search bar to urlParams
    const urlParams = new URLSearchParams(window.location.search);
    //IF urlParms has code
    if (urlParams.has("code")) {
      //save code to code variable
      let code = urlParams.get("code");
      //store code in session storage
      sessionStorage.setItem("code", code);

      // Strip ?code=... and return to / — prevents re-reading a stale code
      // on refresh; replaceState avoids a full page reload.
      window.history.replaceState({}, document.title, "/");
    }
  }, []); //run once no dependency
  return (
    <>
      <button
        onClick={() => {
          onConnect();
        }}
        className="bg-[#22C55E] text-[#064E1E] text-sm font-semibold px-8 py-2.5 rounded-full cursor-pointer"
      >
        Connect to Spotify
      </button>
    </>
  );
}

export default App;
