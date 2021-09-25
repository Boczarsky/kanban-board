import { DragEventHandler, useRef } from "react";
import { BoardColumn } from "../../types";
import AddTaskModal from "../AddTaskModal";
import { useKanbanBoardContext } from "../KanbanBoard/useKanbanBoard";
import KanbanTask from "../KanbanTask";
import './styles.scss'

interface KanbanColumnProps {
  data: BoardColumn;
  canAddTask?: boolean;
}
function KanbanColumn(props: KanbanColumnProps) {
  const {data: {id, title, tasks, color}, canAddTask} = props
  const {moveTask, addTask} = useKanbanBoardContext()
  const taskContainer = useRef<HTMLDivElement>(null)
  const closestTaskId = useRef<string | null>(null)
  const handleDrop: DragEventHandler = event => {
    const taskId = event.dataTransfer.getData('taskId')
    moveTask(taskId, closestTaskId.current, id)
  }
  const handleDragOver: DragEventHandler = event => {
    event.preventDefault()
    const {children = []} = taskContainer.current ?? {}
    const tasksInColumn = Array.from(children)
    const {taskId} = tasksInColumn.reduce((distanceData: {distance: number, taskId: string | null}, taskElement) => {
      const {top, height} = taskElement.getBoundingClientRect()
      const yPosition = top + height/2
      const distance = yPosition - event.clientY
      if (distance > 0 && distance < distanceData.distance) {
        return {
          distance,
          taskId: taskElement.getAttribute('data-taskid')
        }
      }

      return distanceData
    }, {distance: Number.POSITIVE_INFINITY, taskId: null})

    closestTaskId.current = taskId
  }
  const handleConfirm = (title: string, description: string) => {
    addTask(id, title, description)
  }

  return (
    <div className="kanban-column">
      <header className="column-title" style={{borderRightColor: color, borderLeftColor: color}}>
        <span>{title}</span>
        {canAddTask && <AddTaskModal onConfirm={handleConfirm}/>}
      </header>
      <div ref={taskContainer} className="tasks-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        {tasks.map(task => <KanbanTask key={task.id} data={task}/>)}
      </div>
    </div>
  )
}

export default KanbanColumn