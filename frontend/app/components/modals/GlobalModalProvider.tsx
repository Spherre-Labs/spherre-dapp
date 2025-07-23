'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import SuccessModal from './SuccessModal'
import ErrorModal from './ErrorModal'
import ProcessingModal from './Loader'

// Modal prop types
interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onViewTransaction?: () => void
  title?: string
  message?: string
  closeLabel?: string
  viewLabel?: string
}

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorText?: string
  title?: string
}

interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
}

type ModalState =
  | { type: 'success'; props: Omit<SuccessModalProps, 'isOpen' | 'onClose'> }
  | { type: 'error'; props: Omit<ErrorModalProps, 'isOpen' | 'onClose'> }
  | {
      type: 'processing'
      props: Omit<ProcessingModalProps, 'isOpen' | 'onClose'>
    }
  | { type: null }

interface GlobalModalContextType {
  showSuccess: (props: Omit<SuccessModalProps, 'isOpen' | 'onClose'>) => void
  showError: (props: Omit<ErrorModalProps, 'isOpen' | 'onClose'>) => void
  showProcessing: (
    props?: Omit<ProcessingModalProps, 'isOpen' | 'onClose'>,
  ) => void
  hideModal: () => void
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(
  undefined,
)

export const useGlobalModal = () => {
  const ctx = useContext(GlobalModalContext)
  if (!ctx)
    throw new Error('useGlobalModal must be used within GlobalModalProvider')
  return ctx
}

export const GlobalModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState>({ type: null })

  const hideModal = () => setModal({ type: null })

  const showSuccess = (props: Omit<SuccessModalProps, 'isOpen' | 'onClose'>) =>
    setModal({ type: 'success', props })
  const showError = (props: Omit<ErrorModalProps, 'isOpen' | 'onClose'>) =>
    setModal({ type: 'error', props })
  const showProcessing = (
    props: Omit<ProcessingModalProps, 'isOpen' | 'onClose'> = {},
  ) => setModal({ type: 'processing', props })

  return (
    <GlobalModalContext.Provider
      value={{ showSuccess, showError, showProcessing, hideModal }}
    >
      {children}
      {/* Render the appropriate modal */}
      {modal.type === 'success' && (
        <SuccessModal isOpen={true} onClose={hideModal} {...modal.props} />
      )}
      {modal.type === 'error' && (
        <ErrorModal isOpen={true} onClose={hideModal} {...modal.props} />
      )}
      {modal.type === 'processing' && (
        <ProcessingModal isOpen={true} onClose={hideModal} {...modal.props} />
      )}
    </GlobalModalContext.Provider>
  )
}
