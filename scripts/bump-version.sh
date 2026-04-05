#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CURRENT_VERSION="$(jq -r '.version' "$REPO_ROOT/package.json")"
echo "Current version: $CURRENT_VERSION"

# Prompt for version number
read -p "New version number: " VERSION

if [[ -z "$VERSION" ]]; then
  echo "Error: version number cannot be empty." >&2
  exit 1
fi

echo "Bumping to version $VERSION..."

# Update root package.json
tmp=$(mktemp)
jq --arg v "$VERSION" '.version = $v' "$REPO_ROOT/package.json" > "$tmp" && mv "$tmp" "$REPO_ROOT/package.json"
echo "  Updated package.json"

# Update package-lock.json at root
(cd "$REPO_ROOT" && npm install --package-lock-only)
echo "  Updated package-lock.json at root"

# Update create-presenter package.json
tmp=$(mktemp)
jq --arg v "$VERSION" '.version = $v' "$REPO_ROOT/packages/create-presenter/package.json" > "$tmp" && mv "$tmp" "$REPO_ROOT/packages/create-presenter/package.json"
echo "  Updated packages/create-presenter/package.json"

# Update package-lock.json in create-presenter
(cd "$REPO_ROOT/packages/create-presenter" && npm install --package-lock-only)
echo "  Updated package-lock.json in packages/create-presenter"

# Update presenter dependency in templates
tmp=$(mktemp)
jq --arg v "^$VERSION" '.dependencies.presenter = $v' "$REPO_ROOT/packages/create-presenter/src/templates/presentation/package.json" > "$tmp" && mv "$tmp" "$REPO_ROOT/packages/create-presenter/src/templates/presentation/package.json"
echo "  Updated packages/create-presenter/src/templates/presentation/package.json"

tmp=$(mktemp)
jq --arg v "^$VERSION" '.peerDependencies.presenter = $v' "$REPO_ROOT/packages/create-presenter/src/templates/lib/package.json" > "$tmp" && mv "$tmp" "$REPO_ROOT/packages/create-presenter/src/templates/lib/package.json"
echo "  Updated packages/create-presenter/src/templates/lib/package.json"

echo "Done. Version bumped to $VERSION."
