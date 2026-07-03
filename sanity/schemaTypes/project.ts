import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(2100),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, venue or country where the project was presented',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'role', title: 'Role', type: 'string' }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
          ],
          preview: {
            select: { title: 'role', subtitle: 'name' },
          },
        },
      ],
    }),
    defineField({
      name: 'performanceDates',
      title: 'Performance Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'date', title: 'Date', type: 'date' }),
            defineField({ name: 'venue', title: 'Venue', type: 'string' }),
            defineField({ name: 'city', title: 'City', type: 'string' }),
          ],
          preview: {
            select: { title: 'date', subtitle: 'venue' },
          },
        },
      ],
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews & Press Quotes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
            defineField({ name: 'reviewer', title: 'Reviewer Name', type: 'string' }),
            defineField({ name: 'publication', title: 'Publication', type: 'string' }),
          ],
          preview: {
            select: { title: 'publication', subtitle: 'reviewer' },
          },
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators (legacy)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Use Credits above for new projects.',
    }),
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'coverImage' },
    prepare({ title, year, media }) {
      return { title, subtitle: String(year), media }
    },
  },
})
