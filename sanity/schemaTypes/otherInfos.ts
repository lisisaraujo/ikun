import { defineField, defineType } from 'sanity'

// Singleton — press, partners, governance, misc
export default defineType({
  name: 'otherInfos',
  title: 'Other Infos',
  type: 'document',
  fields: [
    defineField({
      name: 'pressItems',
      title: 'Press & Media',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pressItem',
          fields: [
            defineField({ name: 'publication', title: 'Publication', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'Link', type: 'url' }),
            defineField({ name: 'date', title: 'Date', type: 'date' }),
          ],
          preview: {
            select: { title: 'publication', subtitle: 'headline' },
          },
        },
      ],
    }),
    defineField({
      name: 'partners',
      title: 'Partners & Funders',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'partner',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Funder', value: 'funder' },
                  { title: 'Partner', value: 'partner' },
                ],
                layout: 'radio',
              },
              initialValue: 'partner',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', title: 'Website', type: 'url' }),
            defineField({ name: 'showInFooter', title: 'Show in footer', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'name', media: 'logo' },
          },
        },
      ],
    }),
    defineField({
      name: 'governance',
      title: 'Governance & Legal',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'miscContent',
      title: 'Miscellaneous Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Other Infos Page' }
    },
  },
})
