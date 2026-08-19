import { redirectToSpotifyAuthorize } from "./utils/SpotifyRedirect";

const onConnect = async () => {
  redirectToSpotifyAuthorize()
};

function App() {
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
