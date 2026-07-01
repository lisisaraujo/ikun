import { defineField, defineType } from 'sanity'

// Singleton document — homepage hero and intro text
export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL (YouTube)',
      type: 'url',
      description: 'Full YouTube URL, e.g. https://www.youtube.com/watch?v=xxxxx',
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
