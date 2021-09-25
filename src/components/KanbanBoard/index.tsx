import KanbanColumn from "../KanbanColumn";
import './styles.scss'
import { useKanbanBoardContext } from "./useKanbanBoard";

function KanbanBoard() {
  const {state, toggleSaveInLocalStorage} = useKanbanBoardContext()

  return (
      <div className="kanban-board">
        <div className="local-storage-save-control">
          <input checked={state.saveInLocalStorage} onChange={toggleSaveInLocalStorage} type="checkbox"/>
          <label>Store data in local storage</label>
        </div>
        <div className="columns-wrapper">
          {state.columns.map(column => <KanbanColumn key={column.id} data={column} canAddTask={column.addTaskEnabled}/>)}
        </div>
      </div>
  );
}

export default KanbanBoard