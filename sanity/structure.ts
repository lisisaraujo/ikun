import type { StructureResolver } from 'sanity/structure'

// Singletons: homePage, aboutPage, otherInfos — only one document of each should exist
const SINGLETONS = ['homePage', 'aboutPage', 'otherInfos']

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

      S.listItem()
        .title('Other Infos')
        .id('otherInfos')
        .child(S.document().schemaType('otherInfos').documentId('otherInfos')),

      S.divider(),

      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('calendarEvent').title('Calendar Events'),
      S.documentTypeListItem('ironuPost').title('Irònú Posts'),

      S.divider(),

      // Filter out singletons from the default "All documents" list
      ...S.documentTypeListItems().filter(
        (item) => item.getId() != null && !SINGLETONS.includes(item.getId()!)
      ),
    ])
