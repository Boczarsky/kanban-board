import { DragEventHandler } from "react";
import { ColumnTask } from "../../types";
import { useKanbanBoardContext } from "../KanbanBoard/useKanbanBoard";
import './styles.scss'

interface KanbanTaskProps {
  data: ColumnTask;
}
function KanbanTask(props: KanbanTaskProps) {
  const {data: {id, title, description}} = props
  const {removeTask} = useKanbanBoardContext()
  const handleDragStart: DragEventHandler<HTMLDivElement> = event => {
    event.dataTransfer.setData('taskId', id)
    const draggedElement = event.target as HTMLDivElement
    draggedElement.classList.add('dragging')
  }
  const handleDragEnd: DragEventHandler<HTMLDivElement> = event => {
    const draggedElement = event.target as HTMLDivElement
    draggedElement.classList.remove('dragging')
  }
  const handleRemove = () => {
    removeTask(id)
  }

  return (
    <div className="kanban-task" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} data-taskid={id}>
      <header className="task-header">
        <span>{title}</span>
        <button className="remove-button" onClick={handleRemove}/>
      </header>
      <div>{description}</div>
    </div>
  )
}

export default KanbanTask