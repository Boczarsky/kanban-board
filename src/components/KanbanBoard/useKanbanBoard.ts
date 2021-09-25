import { createContext, useContext, useReducer, useState } from "react";
import { BoardColumn, ColumnTask } from "../../types";

const noop = () => {}

interface State {
  saveInLocalStorage: boolean;
  columns: BoardColumn[];
}

enum ActionTypes {
  addTask = 'ADD_TASK',
  removeTask = 'REMOVE_TASK',
  moveTask = 'MOVE_TASK',
  toggleSaveInLocalStorage = 'TOGGLE_SAVE_IN_LOCAL_STORAGE'
}

interface TaskPointer {
  taskId: string;
  columnId: string;
  closestTaskId?: string | null;
}

interface AddTaskAction {
  columnId: string;
  task: ColumnTask;
}

interface Action {
  type: ActionTypes;
  payload?: AddTaskAction | TaskPointer | Partial<TaskPointer>;
}

const initialState: State = {
  saveInLocalStorage: false,
  columns: [
    {
      id: 'to-do-column',
      title: 'To Do',
      color: '#ffffff',
      addTaskEnabled: true,
      tasks: [
        {
          id: '#1',
          title: 'Draggable tasks',
          description: 'Make tasks draggable. You must be able to drag task from one column to another.'
        },
        {
          id: '#2',
          title: 'Createable tasks',
          description: 'Make tasks createable. You must be able to toggle task creation modal and after submitting form task should appear in column.'
        },
        {
          id: '#3',
          title: 'Removable tasks',
          description: 'Make tasks removable. You must be able to remove task'
        },
        {
          id: '#4',
          title: 'Movable tasks',
          description: 'Makes tasks movable. You must be able to change order of tasks by placing them above or below task.'
        },
        {
          id: '#5',
          title: 'Persistent store',
          description: 'Make store persistent. You must be able to toggle storing data in local storage. State should persist after application refresh.'
        }
      ]
    },
    {
      id: 'in-progress-column',
      color: '#4cb7ff',
      title: 'In Progress',
      tasks: []
    },
    {
      id: 'complete-column',
      color: '#78dd73',
      title: 'Complete',
      tasks: []
    }
  ]
}

function initializer(initialValue: State) {
  const storedStateJSON = localStorage.getItem('kanbanBoardState')
  if (storedStateJSON) {
    const storedState: State = JSON.parse(storedStateJSON)
    if (storedState.saveInLocalStorage) {
      return storedState
    }
  }

  return initialValue
}

function getInitialHighestId(columns: BoardColumn[]) {
  return columns
    .flatMap(column => column.tasks)
    .map(task => Number(task.id.replace('#', '')))
    .reduce((highestId, id) => highestId < id ? id : highestId, 1)
}

function addTaskToColumn(state: State, columnId: string, task: ColumnTask, closestTaskId?: string | null): State {
  const columnsCopy = [...state.columns]
  const columnIndex = columnsCopy.findIndex(column => column.id === columnId)
  if (columnIndex > -1) {
    let newTasksState
    const {tasks} = columnsCopy[columnIndex]
    if (closestTaskId) {
      const taskIndex = tasks.findIndex(({id}) => id === closestTaskId)
      if (taskIndex > -1) {
        newTasksState = [...tasks.slice(0, taskIndex), task, ...tasks.slice(taskIndex)]
      } else {
        newTasksState = [...tasks, task]
      }
    } else {
      newTasksState = [...tasks, task]
    }
    columnsCopy[columnIndex] = {
      ...columnsCopy[columnIndex],
      tasks: newTasksState
    }

    return {
      ...state,
      columns: columnsCopy
    }
  }

  return state
}

function removeTaskFromColumn(state: State, columnId: string, taskId: string): State {
  const columnsCopy = [...state.columns]
  const columnIndex = columnsCopy.findIndex(column => column.id === columnId)
  if (columnIndex > -1) {
    columnsCopy[columnIndex] = {
      ...columnsCopy[columnIndex],
      tasks: columnsCopy[columnIndex].tasks.filter(task => task.id !== taskId),
    }

    return {
      ...state,
      columns: columnsCopy
    }
  }

  return state
}

function findColumnIdByTaskId(state: State, taskId: string): string {
  const columnFound = state.columns
    .find(column => column.tasks
      .some(task => task.id === taskId))
  if (columnFound) {
    return columnFound.id
  }

  return ''
}

function findTaskById(state: State, taskId: string): ColumnTask | undefined {
  for (const column of state.columns) {
    const taskFound = column.tasks.find(task => task.id === taskId)
    if (taskFound) return taskFound
  }

  return undefined
}

const reducer = (state: State, action: Action) => {
  const {type, payload} = action
  switch (type) {
    case ActionTypes.addTask:
      const {task, columnId} = payload as AddTaskAction

      return addTaskToColumn(state, columnId, task)

    case ActionTypes.removeTask: {
      const {taskId} = payload as TaskPointer
      const columnId = findColumnIdByTaskId(state, taskId)

      return removeTaskFromColumn(state, columnId, taskId)
    }
    case ActionTypes.moveTask: {
      const {taskId, columnId, closestTaskId} = payload as TaskPointer
      const columnIdForRemoval = findColumnIdByTaskId(state, taskId)
      const task = findTaskById(state, taskId)
      if (!task) return state
      const stateAfterRemoval = removeTaskFromColumn(state, columnIdForRemoval, taskId)
      const stateAfterAddition = addTaskToColumn(stateAfterRemoval, columnId, task, closestTaskId)

      return stateAfterAddition
    }
    case ActionTypes.toggleSaveInLocalStorage:
      return {
        ...state,
        saveInLocalStorage: !state.saveInLocalStorage
      }
    default:
      return state
  }
}

interface KanbanBoardContext {
  state: State;
  addTask: (columnId: string, title: string, desctiption: string) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, closestTaskId: string | null, columnId: string) => void;
  toggleSaveInLocalStorage: () => void;
}

export const kanbanBoardContext = createContext<KanbanBoardContext>({
  state: initialState,
  addTask: noop,
  removeTask: noop,
  moveTask: noop,
  toggleSaveInLocalStorage: noop,
});

export const useKanbanBoardContext = () => useContext(kanbanBoardContext)

export const useKanbanBoard = () => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer)
  const [highestId, setHighestId] = useState(getInitialHighestId(state.columns))

  if (state.saveInLocalStorage) {
    localStorage.setItem('kanbanBoardState', JSON.stringify(state))
  } else {
    localStorage.removeItem('kanbanBoardState')
  }

  const generateId = () => {
    const newId = highestId + 1
    setHighestId(newId)

    return `#${newId}`
  }

  const addTask = (columnId: string, title: string, description: string) => dispatch({
    type: ActionTypes.addTask,
    payload: {
      columnId,
      task: {
        id: generateId(),
        title,
        description,
      },
    },
  })

  const removeTask = (taskId: string) => dispatch({type: ActionTypes.removeTask, payload: {taskId}})

  const moveTask = (taskId: string, closestTaskId: string | null, columnId: string) => dispatch({type: ActionTypes.moveTask, payload: {taskId, columnId, closestTaskId}})

  const toggleSaveInLocalStorage = () => dispatch({type: ActionTypes.toggleSaveInLocalStorage})

  return {state, addTask, removeTask, moveTask, toggleSaveInLocalStorage}
}