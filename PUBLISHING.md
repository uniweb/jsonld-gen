# Publishing Guide

## First Time Publishing (Manual)

### Prerequisites
1. npm account with access to the `@uniweb` scope
2. Logged into npm locally: `npm login`

### Steps
```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Publish to npm (build runs automatically)
npm publish --access public

# 3. Push the version tag to GitHub
git push --follow-tags
```

**Note:** The `prepublishOnly` script automatically runs `npm run build` before publishing, so you don't need to build manually.

## Automated Publishing (Recommended)

### Setup (One-time)

1. **Create npm access token**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token

2. **Add token to GitHub**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

### Publishing Process

Once set up, publishing is simple:

```bash
# 1. Update version
npm version patch  # or minor, or major

# 2. Push changes
git push

# 3. Create a GitHub release
# Go to GitHub → Releases → "Create a new release"
# Or use the GitHub CLI:
gh release create v0.1.1 --title "v0.1.1" --notes "Release notes here"
```

The GitHub Action will automatically:
- Install dependencies
- Run the build (via prepublishOnly)
- Publish to npm with provenance
- Link the package to this GitHub repo

### Versioning

Follow [Semantic Versioning](https://semver.org/):
- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features, backwards compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

```bash
npm version patch -m "Fix: description"
npm version minor -m "Add: new feature"
npm version major -m "Breaking: major change"
```

## What Gets Published

The `files` field in package.json controls what gets published:
- `dist/` - Built files
- `README.md` - Documentation
- `LICENSE` - License file
- `package.json` - Automatically included

Source files (`src/`) are NOT published, keeping the package size small.

## Workflow Files

### `.github/workflows/publish.yml`
Automatically publishes to npm when you create a GitHub release.

### `.github/workflows/ci.yml`
Tests the build on Node 18, 20, and 22 for every push and PR to ensure compatibility.

## Testing Before Publishing

```bash
# Build locally
npm run build

# Test the package locally in another project
npm pack
# This creates a .tgz file you can install in another project:
# npm install /path/to/uniweb-jsonld-gen-0.1.0.tgz
```

## Troubleshooting

**Error: "You must verify your email..."**
- Go to npmjs.com and verify your email address

**Error: "You do not have permission to publish..."**
- Make sure you're logged into the correct npm account
- Verify you have access to the `@uniweb` scope

**Error: "Version already exists"**
- Run `npm version patch` to bump the version before publishing
