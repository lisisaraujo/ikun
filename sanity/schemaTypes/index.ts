import { type SchemaTypeDefinition } from 'sanity'

import project from './project'
import calendarEvent from './calendarEvent'
import ironuPost from './ironuPost'
import aboutPage from './aboutPage'
import homePage from './homePage'
import otherInfos from './otherInfos'
import globalSettings from './globalSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, calendarEvent, ironuPost, aboutPage, homePage, otherInfos, globalSettings],
}
