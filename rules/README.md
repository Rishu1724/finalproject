# Executable food-label rules

This directory will contain only rules that have been converted from an
official source, reviewed by a human, and covered by tests.

Draft rules must remain separate from active rules. A rule is not active merely
because an AI model extracted it from a document.

Each active rule must include:

- Stable rule ID and version.
- Food-product scope and applicability conditions.
- Check type and machine-readable configuration.
- Official source document and provision.
- Publication and effective dates.
- Verification status and reviewer record.
- Positive, negative, exception, and uncertainty test cases.

## Rule Studio workflow

The first implementation milestone is the User-defined Rule Studio. A rule
draft must move through these states:

```text
user/source input
      -> AI-assisted draft (optional)
      -> human editing and source verification
      -> executable test cases
      -> test results reviewed
      -> approved active rule
```

AI may suggest a structure, but it must not silently activate a rule, invent a
source provision, or replace human approval. Test fixtures must be original,
permissioned, or derived from official source examples with their provenance
recorded.

Every rule change must also be recorded in the root `README.md`.
