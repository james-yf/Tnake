import Game from "./Game";

const GAME_CONFIG = { rows: 10, cols: 10, size: 40 } as const;

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-amber-200">
      <Game {...GAME_CONFIG} />
    </div>
  );
}

export default App;
