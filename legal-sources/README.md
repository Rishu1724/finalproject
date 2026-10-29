# Official food-label sources

This directory is reserved for source material used by MetriCheck AI. The first
release is limited to packaged food sold in India and covers:

- Food Safety and Standards Authority of India (FSSAI) labelling requirements.
- Legal Metrology requirements for packaged commodities.

## Source policy

Only documents published by an Indian government authority or an official
Gazette are eligible for activation as compliance rules. Blog posts, AI
responses, vendor documentation, and third-party summaries may help locate a
provision, but they are not legal sources.

For every source document we will preserve:

- The original PDF without edits.
- The exact official URL.
- Issuing authority and document type.
- Notification or amendment number, when present.
- Publication and effective dates.
- Retrieval date.
- SHA-256 hash of the downloaded file.
- A human verification record before any rule is activated.

## Official starting points

- FSSAI regulations: <https://www.fssai.gov.in/cms/food-safety-and-standards-regulations.php>
- FSSAI main portal: <https://www.fssai.gov.in/>
- Department of Consumer Affairs: <https://consumeraffairs.nic.in/>
- India Code: <https://www.indiacode.nic.in/>
- Gazette of India: <https://egazette.gov.in/>

## Directory layout

```text
legal-sources/
├── documents/
│   ├── fssai-labelling-display-regulations.pdf
│   ├── fssai-labelling-amendment-01.pdf
│   ├── legal-metrology-packaged-commodities-rules.pdf
│   └── README.md
├── extracted-text/
│   └── README.md
├── rule-drafts/
│   ├── README.md
│   └── *.json
├── rule-tests/
│   ├── README.md
│   └── *.json
├── README.md
└── source-manifest.json
```

The exact regulation or Gazette PDF URL must be recorded in
`source-manifest.json` after it has been downloaded from the official site.
The application must not treat a source with a pending status as an active
legal rule.

## Acquisition workflow

1. Download the original document from an official government domain.
2. Save it under `legal-sources/documents/` using a stable filename.
3. Calculate its SHA-256 hash.
4. Add the exact URL, dates, and hash to `source-manifest.json`.
5. Extract text for analysis without modifying the original PDF.
6. Convert requirements into draft rules.
7. Verify every draft against the original document.
8. Add tests and approve the rule before activation.

This repository is a compliance-screening aid, not an official certification
or legal opinion.
