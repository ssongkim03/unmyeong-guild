import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Character } from '@/types'

type CharacterStore = {
  myCharacter: Character | null
  setMyCharacter: (character: Character) => void
  clearCharacter: () => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      myCharacter: null,
      setMyCharacter: (character) => set({ myCharacter: character }),
      clearCharacter: () => set({ myCharacter: null }),
    }),
    { name: 'unmyeong-character' }
  )
)