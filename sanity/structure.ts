import type { StructureResolver } from 'sanity/structure'

// All types that are explicitly listed above — excluded from the auto-generated fallback
const EXPLICITLY_LISTED = ['homePage', 'aboutPage', 'otherInfos', 'project', 'calendarEvent', 'ironuPost']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),

      S.divider(),

      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('calendarEvent').title('Calendar Events'),
      S.documentTypeListItem('ironuPost').title('Irònú Posts'),

      S.divider(),

      // Auto-append any future schema types not already listed above
      ...S.documentTypeListItems().filter(
        (item) => item.getId() != null && !EXPLICITLY_LISTED.includes(item.getId()!)
      ),
    ])
