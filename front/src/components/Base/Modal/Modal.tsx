import {FC, PropsWithChildren} from 'react'
import {DivCommonProps} from '../Props'

export type ModalProps = DivCommonProps & {
  isOpen: boolean
  onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children,
  className: _className,
  ...props
}) => {
  const className = [
    '', //
    _className
  ].join(' ')

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
