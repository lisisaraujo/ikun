import { defineField, defineType } from 'sanity'

// Singleton document — one "About" page managed via Sanity
export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'photoCaption',
      title: 'Photo Caption',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
