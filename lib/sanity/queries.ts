import { sanityClient } from './client'
import type {
  SanityProject,
  CalendarEvent,
  IronuPost,
  AboutPage,
  HomePage,
  OtherInfos,
  GlobalSettings,
} from '@/types/sanity'

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<SanityProject[]> {
  return sanityClient.fetch(
    `*[_type == "project"] | order(year desc) {
      _id, _createdAt, title, slug, year, location,
      coverImage, shortDescription, youtubeUrl, collaborators
    }`
  )
}

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  return sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id, _createdAt, title, slug, year, location,
      coverImage, shortDescription, fullDescription,
      credits[] { _key, role, name },
      performanceDates[] { _key, date, venue, city },
      reviews[] { _key, quote, reviewer, publication },
      images[] { _key, asset, hotspot, crop, caption },
      youtubeUrl, collaborators
    }`,
    { slug }
  )
}

// ── Calendar Events ───────────────────────────────────────────────────────────

export async function getAllEvents(): Promise<CalendarEvent[]> {
  return sanityClient.fetch(
    `*[_type == "calendarEvent"] | order(date desc) {
      _id, _createdAt, title, eventType, date,
      venue, city, country, ticketLink, description
    }`
  )
}

// ── Irònú Posts ───────────────────────────────────────────────────────────────

export async function getAllIronuPosts(): Promise<IronuPost[]> {
  return sanityClient.fetch(
    `*[_type == "ironuPost"] | order(date desc) {
      _id, _createdAt, title, slug, date, coverImage
    }`
  )
}

export async function getIronuPostBySlug(slug: string): Promise<IronuPost | null> {
  return sanityClient.fetch(
    `*[_type == "ironuPost" && slug.current == $slug][0] {
      _id, _createdAt, title, slug, date, coverImage, videoUrl, body
    }`,
    { slug }
  )
}

// ── Singleton pages ───────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityClient.fetch(
    `*[_type == "aboutPage" && _id == "aboutPage"][0] {
      _id, bio, photo, photoCaption
    }`
  )
}

export async function getHomePage(): Promise<HomePage | null> {
  return sanityClient.fetch(
    `*[_type == "homePage" && _id == "homePage"][0] {
      _id, heroVideoUrl, introHeading, introText
    }`
  )
}

export async function getOtherInfos(): Promise<OtherInfos | null> {
  return sanityClient.fetch(
    `*[_type == "otherInfos" && _id == "otherInfos"][0] {
      _id,
      pressItems[] { _key, publication, headline, url, date },
      partners[] { _key, name, category, showInFooter, logo, url },
      governance,
      miscContent
    }`
  )
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return sanityClient.fetch(
    `*[_type == "globalSettings"][0] {
      _id, email, instagramUrl, youtubeUrl, vimeoUrl, privacyPolicy
    }`
  )
}
