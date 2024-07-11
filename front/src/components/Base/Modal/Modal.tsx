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
  const className = ['bg-white p-6 rounded shadow-lg max-w-lg w-full', _className].join(' ')

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}>
      <div className={className} onClick={e => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  )
}
