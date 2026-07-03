import type { PortableTextBlock } from '@portabletext/types'

// Shared Sanity image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  caption?: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

// Project sub-types
export interface ProjectCredit {
  _key: string
  role: string
  name: string
}

export interface ProjectPerformanceDate {
  _key: string
  date: string   // ISO date string YYYY-MM-DD
  venue?: string
  city?: string
}

export interface ProjectReview {
  _key: string
  quote: string
  reviewer?: string
  publication?: string
}

export interface GalleryImage extends SanityImage {
  _key: string
  caption?: string
}

// Project
export interface SanityProject {
  _id: string
  _createdAt: string
  title: string
  slug: SanitySlug
  year: number
  location?: string
  coverImage?: SanityImage
  shortDescription: string
  fullDescription?: PortableTextBlock[]
  credits?: ProjectCredit[]
  performanceDates?: ProjectPerformanceDate[]
  reviews?: ProjectReview[]
  images?: GalleryImage[]
  youtubeUrl?: string
  collaborators?: string[]
}

// Calendar Event
export type EventType = 'show' | 'workshop' | 'talk' | 'other'

export interface CalendarEvent {
  _id: string
  _createdAt: string
  title: string
  eventType: EventType
  date: string
  venue: string
  city: string
  country: string
  ticketLink?: string
  description?: string
}

// Ìrònú Post
export interface IronuPost {
  _id: string
  _createdAt: string
  title: string
  slug: SanitySlug
  date: string
  coverImage?: SanityImage
  videoUrl?: string
  body?: PortableTextBlock[]
}

// About Page (singleton)
export interface AboutPage {
  _id: string
  bio: PortableTextBlock[]
  photo?: SanityImage
  photoCaption?: string
}

// Home Page (singleton)
export interface HomePage {
  _id: string
  heroVideoUrl: string
  introHeading?: string
  introText: PortableTextBlock[]
}

// Other Infos (singleton)
export interface PressItem {
  _key: string
  publication: string
  headline: string
  url?: string
  date?: string
}

export interface Partner {
  _key: string
  name: string
  category: 'funder' | 'partner'
  logo?: SanityImage
  url?: string
  showInFooter?: boolean
}

export interface GlobalSettings {
  _id: string
  email?: string
  instagramUrl?: string
  youtubeUrl?: string
  vimeoUrl?: string
  privacyPolicy?: import('@portabletext/types').PortableTextBlock[]
}

export interface OtherInfos {
  _id: string
  pressItems?: PressItem[]
  partners?: Partner[]
  governance?: PortableTextBlock[]
  miscContent?: PortableTextBlock[]
}
