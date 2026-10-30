<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Typography

The project uses a shared type system defined in `app/globals.css`. When creating or updating pages and components, use the semantic typography classes below instead of introducing one-off responsive `text-*`, `leading-*`, or `tracking-*` values.

- `type-display`: primary page and section titles; use sparingly.
- `type-title`: prominent content titles and large feature headings.
- `type-heading`: secondary headings and card titles.
- `type-feature`: supporting feature text that needs more emphasis than body copy.
- `type-body`: standard paragraph and descriptive text.
- `type-small`: supporting copy and footer text.
- `type-label`: compact uppercase labels, buttons, and navigation metadata.
- `type-meta`: very small uppercase dates, categories, and captions.
- `type-nav`: desktop section navigation.

The sizing and line-height values for these classes are controlled by the `--type-*` variables in `app/globals.css`. Change the variables centrally if the visual system needs to evolve; do not tune individual sections with new clamp expressions.

### Type scale rule

Use this hierarchy as the default across the site:

| Level | Desktop range | Purpose |
| --- | --- | --- |
| `type-display` | 40–80px | Hero moments and primary page titles only |
| `type-title` | 32–48px | Section titles and prominent feature titles |
| `type-heading` | 22–28px | Card titles and secondary headings |
| `type-feature` | 18–24px | Emphasized supporting text and tab labels |
| `type-body` | 16–18px | Paragraphs and descriptions |
| `type-small` | 13–14px | Supporting copy and footer text |
| `type-label` | 11–13px | Buttons, compact links, and utility labels |
| `type-meta` | 10–12px | Dates, years, categories, and captions |

Keep the approximate ratios intact: section titles should be about 2–2.5 times body text, card titles about 1.4–1.6 times body text, and metadata around 70–80% of body text. Use `1.5–1.65` line-height for body copy and `1.05–1.15` for headings. Keep paragraph measures near 55–70 characters where possible.

Typography guidelines:

- Keep display typography restrained. Use it only for the primary visual moment of a page or section and do not exceed the shared `type-display` token without a clear design reason.
- Use the heading font for titles and the body font for paragraphs. Preserve the existing uppercase treatment for display, title, heading, feature, label, and metadata styles.
- Prefer the smallest appropriate type level. Use large display text only for the primary moment of a page or section.
- Keep body copy at the shared `type-body` scale unless a component has a documented, content-specific need.
- If a new text pattern appears in multiple places, add a semantic type class or variable to `app/globals.css` and reuse it everywhere.
- Keep color, spacing, layout, and interaction classes separate from typography classes so the type system remains easy to adjust globally.
