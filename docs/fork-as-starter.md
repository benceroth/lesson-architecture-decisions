# Using this as a starter for your own repository

GitHub's "Use this template" needs the repository to be marked as a template in its settings. If you want an empty variant, copy only:

```
adr/template.md
trials/
tools/adr_lint.py
tests/test_adr_lint.py      # delete the tests that refer to RelayCart files
.github/workflows/adr-lint.yml
docs/how-to-fill-an-adr.md
```

Then:

1. Add your first ADR under `adr/` from `template.md`.
2. Run `python tools/adr_lint.py adr`.
3. Keep the CI workflow so an ADR without an exit criterion fails the build.

This repository does not ship a separate empty template repository; that is a deliberate limit (see the README's "Known limits").
