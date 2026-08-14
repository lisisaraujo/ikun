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
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(2100),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
      description:
        'Main project description. Use Portable Text so paragraphs, emphasis and links can be preserved.',
    }),

    defineField({
      name: 'featuredNote',
      title: 'Featured Note',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Optional highlighted note, e.g. Aerowaves selection or another important recognition.',
    }),

    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'credit',
          fields: [
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              title: 'role',
              subtitle: 'name',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'commissionedBy',
      title: 'Commissioned / Produced By',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Commissioning, production and funding information related to the work.',
    }),

    defineField({
      name: 'performanceDates',
      title: 'Performance Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'performanceDate',

          fields: [
            defineField({
              name: 'label',
              title: 'Event / Festival',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description:
                'Examples: World Premiere, What Next Dance Festival, Dansens Hus',
            }),

            defineField({
              name: 'venue',
              title: 'Venue',
              type: 'string',
            }),

            defineField({
              name: 'city',
              title: 'City',
              type: 'string',
            }),

            defineField({
              name: 'country',
              title: 'Country',
              type: 'string',
            }),

            defineField({
              name: 'startDate',
              title: 'Start Date',
              type: 'date',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'endDate',
              title: 'End Date',
              type: 'date',
              description:
                'Optional. Use when the performance runs across multiple days.',
            }),
          ],

          preview: {
            select: {
              title: 'label',
              city: 'city',
              country: 'country',
              startDate: 'startDate',
              endDate: 'endDate',
            },

            prepare({
              title,
              city,
              country,
              startDate,
              endDate,
            }) {
              const location = [city, country].filter(Boolean).join(', ')

              const dates =
                startDate && endDate
                  ? `${startDate} – ${endDate}`
                  : startDate

              return {
                title,
                subtitle: [location, dates].filter(Boolean).join(' · '),
              }
            },
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
          options: {
            hotspot: true,
          },

          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),

            defineField({
              name: 'credit',
              title: 'Photo Credit',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'YouTube, Vimeo or another externally hosted video.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      year: 'year',
      media: 'coverImage',
    },

    prepare({ title, year, media }) {
      return {
        title,
        subtitle: year ? String(year) : undefined,
        media,
      }
    },
  },
})
