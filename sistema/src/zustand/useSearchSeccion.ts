import { create } from 'zustand'

export interface searchSeccion {
  search: string
  setSearch: (search: string) => void
}

export const useSearchSeccion = create<searchSeccion>((set) => ({
  search: '',
  setSearch: (search: string) => {
    set({ search })
  }
}))
