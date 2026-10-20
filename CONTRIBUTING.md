# Contributing

Small, focused changes are welcome.

1. Open an issue first for anything beyond a typo or a clear bug.
2. Keep the post's numbers intact: 18 engineers, 11 to 8 services, 14/6/12 deployments, 24/71/31 minutes MTTR, 410/640/430 ms P95, $18,000/$47,000/$29,000. Anything not in the post must be labelled "assumption" or "illustrative".
3. Every ADR must pass the linter and include status, review date, evidence and exit criteria.
4. Run the checks before opening a pull request:

```
python tools/adr_lint.py adr
python -m unittest discover -s tests -v
node --test tests/tco.test.js
```

5. Keep the calculator dependency-free (plain HTML, CSS, JavaScript, no build) and accessible: labelled inputs, keyboard operable, no information by colour alone.
6. Never commit secrets or real company data.

By contributing you agree your work is released under the MIT license.
