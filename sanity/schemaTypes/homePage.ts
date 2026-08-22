import { defineField, defineType } from 'sanity'

// Singleton document — homepage hero and intro text
export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroMuxPlaybackId',
      title: 'Hero Video (Mux Playback ID)',
      type: 'string',
      description: 'Playback ID from your Mux asset, e.g. M02clBfd7hK01r1BzwLj95ji9CE5p01uAjK8tkn00rLhpes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introHeading',
      title: 'Intro Heading',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
