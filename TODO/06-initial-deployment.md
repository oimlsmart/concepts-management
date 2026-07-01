# 06 — Initial deployment via GitHub Pages

## Status

The repo is created and the README is the only deployable content.
Pages URL (once configured): https://oimlsmart.github.io/g18-registry/

## Steps

1. **Set repo GitHub Pages settings**:
   - Settings → Pages → Build and deployment → Source: "GitHub Actions"
   - Custom domain: (none for now; stick with the default `*.github.io/g18-registry/`)

2. **Create `.github/workflows/deploy.yml`**:
   - Trigger on push to `main` (and manual `workflow_dispatch`)
   - Use `actions/checkout@v4`
   - Build step depends on the chosen UI tech (see `TODO/04-browsing-ui.md`)
   - Upload artifact to `actions/upload-pages-artifact@v3`
   - Deploy via `actions/deploy-pages@v4`

3. **Initial placeholder build** (before TODO 04 is done):
   - Minimal static site that:
     - Renders the README as HTML
     - Lists links to the per-task TODO files
     - Shows source-data stats (entry count, unique term count, cross-ref count)
   - Pure HTML+CSS, no JS, fast to build and deploy
   - This gives us a live URL and a place to link from the vocab repo

4. **Validate**:
   - Pages URL is live
   - Build is reproducible (workflow rerun works)
   - HTTPS works

## Acceptance

- Visiting https://oimlsmart.github.io/g18-registry/ shows the placeholder content
- `gh api repos/oimlsmart/g18-registry/pages` shows the deployment is enabled
- Workflow file is in `.github/workflows/deploy.yml`
