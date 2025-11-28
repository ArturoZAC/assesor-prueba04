import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { IoClose } from 'react-icons/io5'

export interface ModalContextType {
  open: boolean
  setModalContent: ({ title, content }: { title: string, content: React.ReactNode }) => void
  handleClose: () => void
}

export const ModalContext = React.createContext<ModalContextType>({
  open: false,
  setModalContent: () => {},
  handleClose: () => {}
})

export default function ModalProvider ({ children }: { children: React.ReactNode }): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState<React.ReactNode>(<></>)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'))

  const setModalContent = ({ title, content }: { title: string, content: React.ReactNode }): void => {
    setOpen(true)
    setTitle(title)
    setContent(content)
  }

  const handleClose = (): void => {
    setOpen(false)
  }
  return (
    <ModalContext.Provider value={{ open, setModalContent, handleClose }}>
      {children}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          '.MuiDialog-paper': {
            backgroundColor: '#fff !important',
            width: '100% !important'
          }
        }}
      >
        <button title='cerrar' onClick={handleClose} type='button' className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none'>
          <IoClose size={25} color='black' />
        </button>
        <DialogTitle id="responsive-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <div className='w-full h-auto'>
            {content}
          </div>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}
