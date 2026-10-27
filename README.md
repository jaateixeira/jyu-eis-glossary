# JYU Glossary of Enterprise Information Systems

Glossary for the University of Jyväskylä course *Enterprise Information Systems / Yritysjärjestelmät*, in **English, Finnish, Swedish, Spanish, Portuguese and French**. Every term is named and defined in all six languages; readers choose any two to read side by side, and see the term in the other four underneath. Finnish compounds are shown split at their seams with a word-by-word gloss.

The site is published with GitHub Pages straight from this repository. There is nothing to build or install: edit a file on GitHub, commit, and the site updates within a minute or two.

## Where things are

| File | What it holds |
|---|---|
| `_data/glossary.yml` | **All the terms, definitions and categories.** This is the file you normally edit. |
| `_config.yml` | Site title, course name, maintainer, **the list of languages** and the default pair |
| `index.html` | Page template (renders the terms from the data file) |
| `assets/css/glossary.css` | Styles, including the print layout |
| `assets/js/glossary.js` | Language pair, search, area filter and sort |
| `.github/ISSUE_TEMPLATE/new-term.yml` | The "Suggest a term" form students fill in |

## Add a term

Open `_data/glossary.yml` on GitHub, click the pencil icon, and add a block under `terms:` (order doesn't matter – the page sorts alphabetically in whichever language the reader puts first):

```yaml
  - id: bom
    category: erp
    abbr: BOM
    term:
      en: Bill of materials
      fi: tuoterakenne
      sv: stycklista
      es: lista de materiales
      pt: lista de materiais
      fr: nomenclature
    fi_split: tuote|rakenne
    fi_gloss: product|structure
    def:
      en: >-
        The list of components and quantities needed to make one unit of a product.
      fi: >-
        Luettelo osista ja niiden määristä, joita tarvitaan yhden tuotteen valmistamiseen.
      sv: >-
        Förteckningen över de komponenter och mängder som behövs för att tillverka en enhet av en produkt.
      es: >-
        Relación de componentes y cantidades necesarios para fabricar una unidad de un producto.
      pt: >-
        Lista dos componentes e quantidades necessários para fabricar uma unidade de um produto.
      fr: >-
        Liste des composants et des quantités nécessaires pour fabriquer une unité d'un produit.
    related: [erp, inventory]
    status: draft
```

- **Required:** `id`, `category` (one of the ids under `categories:`), a `term` in every language, and a `def` in at least English and Finnish. A missing definition in another language shows a short "not yet available" note in that language.
- `alt` lists synonyms per language, e.g. `alt: { fr: [PGI], es: [sistema ERP] }`. They are shown and searchable.
- `fi_split` / `fi_gloss` are optional. Use them for Finnish compounds; they need the same number of `|`-separated parts, and the parts must join back into the Finnish term.
- `course` says where the term comes up on the course (e.g. `Hands-on Exercise 2`); `see` lists course readings.
- `status: draft` shows the entry as not yet reviewed. Delete the line once the teaching team has checked it.
- Indentation matters in YAML: two spaces, never tabs. If the site stops updating after an edit, open the repository's **Actions** tab – the failed run names the line with the error.

## Add or remove a language

Languages are listed under `languages:` in `_config.yml`. To add one (say German), add an entry there with its `code` (`de`), English `name`, `native` name, the word for "also", and the "no definition yet" sentence – then give every term a `term.de` (and ideally a `def.de`). The menus, search and sorting pick it up automatically.

`default_left` and `default_right` set the pair a first-time visitor sees (English and Finnish).

## Link to a term

Every term has its own address, for slides, Moodle and handouts:

- One term: `https://<username>.github.io/jyu-eis-glossary/#erp`
- A language pair: `…/?l=es&r=fi` (Spanish and Finnish; codes as in `_config.yml`)
- A search: `…/?q=varasto`
- One area: `…/?cat=crm`
- Combined: `…/?l=sv&r=en&cat=process#bottleneck`

Readers' language choice is remembered in their browser. Printing the page (Ctrl/Cmd + P) gives a two-column handout of whatever is currently shown, so choose the pair and filter first.

## Student suggestions

The **Suggest a term** link opens the form in `.github/ISSUE_TEMPLATE/new-term.yml` (students need a GitHub account). Review the issue, add the term to the data file, and close the issue with a link to the commit.

## Preview locally (optional)

```sh
bundle exec jekyll serve   # with the github-pages gem installed
```

## Licence

Text: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Fonts: Poppins and Source Serif 4, SIL Open Font License (see `assets/fonts/`).
