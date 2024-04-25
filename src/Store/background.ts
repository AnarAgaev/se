import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useBackground = create<BackgroundsInterface>()(devtools((set, get) => ({
    backgrounds: []
})))

export default useBackground
