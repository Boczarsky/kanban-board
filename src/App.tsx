import KanbanBoard from "./components/KanbanBoard";
import {kanbanBoardContext, useKanbanBoard} from "./components/KanbanBoard/useKanbanBoard";

function App() {
  const value = useKanbanBoard()

  return (
    <div>
      <kanbanBoardContext.Provider value={value}>
        <KanbanBoard/>
      </kanbanBoardContext.Provider>
    </div>
  );
}

export default App;
