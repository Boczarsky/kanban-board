import { ChangeEventHandler, useState } from "react";
import { createPortal } from "react-dom"
import CommonModal from "../CommonModal";
import './styles.scss'

const modalRoot = document.getElementById('modal-root')

interface AddTaskModalProps {
  onConfirm: (title: string, description: string) => void;
}

function AddTaskModal(props: AddTaskModalProps) {
  const {onConfirm} = props;
  const [isOpen, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = (event: any) => {
    event.preventDefault()
    onConfirm(title, description)
    setTitle('')
    setDescription('')
    setOpen(false)
  }
  const handleChange = (setMethod: (value: string) => void): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> => event => {
    setMethod(event.target.value)
  }

  return (
    <>
      <button className="modal-button" onClick={handleOpen}>Add task</button>
      {createPortal((
        <CommonModal isOpen={isOpen} onClose={handleClose}>
          <div>
            <header className="modal-header">Add task</header>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" required value={title} onChange={handleChange(setTitle)}/>
              </div>
              <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" required value={description} onChange={handleChange(setDescription)}/>
              </div>
              <button className="modal-button" type="submit">Add</button>
            </form>
          </div>
        </CommonModal>
      ), modalRoot!)}
    </>
  );
}

export default AddTaskModal