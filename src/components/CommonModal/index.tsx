import { ReactElement, useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import './styles.scss'

interface CommonModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactElement;
}

function noop() {}

function CommonModal(props: CommonModalProps) {
  const {isOpen, children, onClose = noop} = props;
  const ref = useRef<any>()
  useOnClickOutside(ref, onClose)

  return isOpen ? (
    <div className="modal-backdrop">
      <div ref={ref} className="modal-content">
        {children}
      </div>
    </div>
  ) : null;
}

export default CommonModal