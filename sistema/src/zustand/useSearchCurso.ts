import { create } from 'zustand'

export interface searchCurso {
  search: string
  setSearch: (search: string) => void
}

export const useSearchCurso = create<searchCurso>((set) => ({
  search: '',
  setSearch: (search: string) => {
    set({ search })
  }
}))
