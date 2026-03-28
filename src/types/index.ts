export type SENType =
  | 'SLCN'
  | 'ASD'
  | 'SpLD'
  | 'MLD'
  | 'SLD'
  | 'SEMH'
  | 'VI'
  | 'HI'
  | 'PD'
  | 'Other'
  | 'Prefer not to say'
  | 'None'

export type AccountRole = 'child' | 'parent' | 'teacher' | 'admin'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface User {
  id: string
  email: string
  name: string
  role: AccountRole
  yearGroup?: number
  senType?: SENType
  avatar?: string
  streak: number
  stickerCount: number
  createdAt: string
}

export interface AACSymbol {
  id: string
  label: string
  category: string
  subcategory?: string
  emoji?: string
  imageUrl?: string
  spokenText?: string
}

export interface Book {
  id: number
  title: string
  difficulty: Difficulty
  ageRange: string
  description: string
  coverEmoji: string
  pages?: BookPage[]
}

export interface BookPage {
  pageNumber: number
  text: string
  imageDescription?: string
}

export interface MathQuestion {
  id: string
  type: 'multiply' | 'divide' | 'add' | 'subtract'
  a: number
  b: number
  answer: number
  difficulty: Difficulty
}
