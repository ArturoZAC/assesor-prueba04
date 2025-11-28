
import { create } from 'zustand'

interface SubMenuLogic {
  option: string
  setOption: (option: string) => void
}

export const SubMenuLogic = create<SubMenuLogic>((set) => ({
  option: 'operaciones',
  setOption: (option: string) => set({ option })
}))