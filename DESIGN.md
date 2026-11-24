# Design system: The Patient Leaflet

The portfolio is set like a well-designed patient information leaflet: numbered sections, plain answers first, nothing hidden behind toggles. It replaced the earlier Notion-style workspace in November 2026.

## World

- **One white sheet on a cool grey desk.** `--desk #eceef0`, `--sheet #ffffff`, max-width 1200px, 4px radius, soft offset shadow. On mobile the sheet goes full-bleed.
- **Fold creases** separate sections: a 1px `--rule` hairline that draws across (scaleX) on load. No gradients or embossing.
- **Leaflet blue is the only colour.** `--blue #1f45c4` (dark: `#93a9ff`). It marks section numbers, links, the primary button, the about lead and the contact notice tint (`--blue-soft`). Body text stays neutral.
- **No cream, no serif, no cards.** Lists are ruled rows. Boxes appear only where a leaflet would box something: the index, the 3-step plan, the contact notice. All use a 1.5px ink border and 3px radius.

## Type

Schibsted Grotesk only (Google Fonts, variable 400–800).
- h1: clamp(2.75rem, 6.4vw, 5.5rem), weight 650, tracking -0.04em, line-height .98
- h2: clamp(1.9rem, 3.4vw, 2.75rem), weight 650, number prefix in blue ("1.")
- Pull quotes: clamp(1.6rem, 2.75vw, 2.35rem), weight 500, hanging opening quote
- Body: 17px / 1.6; muted text `#5f646c`

## Structure

1. Hero: statement, one-sentence intro, Email me + Read the work. The boxed "What is in this leaflet" index on the right is the site navigation.
2. Selected work: three rows, numbered 1.1–1.3 (gynaecological exam, lifestyle & fertility, the uterus in pregnancy). Each has her verbatim sentence large, then title, one line, topic and a link.
3. All samples: always-visible ruled list of 12 Google Docs articles plus 4 Substack newsletters (type "Newsletter", topic column shows the publication), with All / Health / Lifestyle segmented filter. On hover or keyboard focus (desktop, hover-capable pointers only), a boxed note under the row shows a verbatim line from that sample (`data-excerpt`; `data-source` names where the link opens).
4. Content thinking: the independent exercise, explicitly labelled, in 3 boxed steps.
5. Services: two-column ruled definition list.
6. About me: blue lead line "Clarity is a form of care." plus two paragraphs (approach folded in).
7. Get in touch: boxed notice with Email + Copy address.
8. Footer: "Keep this leaflet. You may need to read it again." and a revision date.

## Behaviour

- The sticky top bar shows the current section number and name; the index marks the active section with `aria-current`.
- Theme follows the system first, the manual toggle is saved to localStorage, and the meta theme-color syncs.
- Motion: crease draw-in on load, row fade-in when filtering, small transform hovers. All are disabled under `prefers-reduced-motion`.
- Breakpoints: 980px (hero, thinking and about stack; library drops the topic column) and 640px (top-bar label hidden, full-bleed sheet, steps stack).

## Sharing

- `dist/og.png` (1200×630) is the social preview: the hero statement plus the contents box, rendered from an HTML card with headless Chrome. It is not AI-generated. Regenerate it the same way when the hero copy changes.
- `dist/favicon.svg`: white “S.” on leaflet blue.
- Open Graph and Twitter tags are in `<head>`. `og:image` is relative until the live domain is known.

## Content rules

Copy is short and in Sophiat's first person. Quotes are true excerpts only. No invented metrics, clients or testimonials (see PRODUCT.md).
