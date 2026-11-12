# Common development workflows. `make help` lists every target by category;
# the conventions are in docs/rules/make-files.md.

.DEFAULT_GOAL := all

STYLEGUIDE_PORT ?= 8888
export STYLEGUIDE_PORT

COMPOSE := docker compose -f styleguide/compose.yaml

##@ Setup

setup: ## Install dependencies (everything needed to run `make up` or `make dev`)
	npm install
	@touch node_modules

# Re-installs only when package.json / package-lock.json are newer than
# node_modules, so build, test and lint stay fast once dependencies are in
# place (and keep working offline).
node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: setup ## Alias for setup

##@ Run

all: help ## Alias for help

up: down ## Build and run the styleguide in Docker for development, attached
	$(COMPOSE) up --build --renew-anon-volumes

down: ## Stop the app and remove the containers it started
	$(COMPOSE) down

running: ## Check whether the styleguide is answering on the styleguide port
	@curl -fs --noproxy '*' -o /dev/null http://localhost:$(STYLEGUIDE_PORT)/ \
		&& echo "running: http://localhost:$(STYLEGUIDE_PORT)" \
		|| { echo "not running"; exit 1; }

# Prerequisite `running` exits with "not running" if nothing answers on the port.
open: running ## Open the running styleguide in the browser
	@open "http://localhost:$(STYLEGUIDE_PORT)" 2>/dev/null || xdg-open "http://localhost:$(STYLEGUIDE_PORT)"

dev: node_modules ## Run the Vite dev server (HMR) locally and open it in the browser
	npm run dev -- --open

start: node_modules ## Build the component library, then serve the styleguide
	npm start

# The container's command (styleguide/Dockerfile). Dependencies are already
# installed in the image, so this skips them.
run: ## Serve the styleguide without installing dependencies (used by the container)
	npm run dev

##@ Build

build: node_modules ## Build the component library once for development (unminified, with sourcemap)
	npm run build -- --mode development --minify false --sourcemap

build-prod: node_modules ## Build the minified production component library bundle
	npm run build

bundle: node_modules ## Build bundle.js and bundle.css (two files, for a page that loads them) in components/compiled/bundle
	npm run build -- --mode bundle

build-app: node_modules ## Build the styleguide app bundle
	npm run build-app

watch: node_modules ## Rebuild the component library on change
	npm run watch

watch-app: node_modules ## Rebuild the styleguide app on change
	npm run watch-app

docker-build: ## Build the styleguide Docker image without starting it
	$(COMPOSE) build

##@ Quality

test: node_modules ## Run every test suite
	npm test

lint: node_modules ## Lint components/
	npm run lint

tokens: node_modules ## Regenerate styles/tokens.json from styles/_colors.scss
	UPDATE_TOKENS=1 npx jest tests/tokensJson.test.js

##@ Cleanup

clean: ## Remove build artifacts (compiled/, node_modules/.cache)
	rm -rf components/compiled public/compiled styleguide/dist node_modules/.cache

##@ Agent rules

AGENT_RULES ?= $(HOME)/Sites/agent-rules

rules: ## Sync shared agent rules from agent-rules into docs/rules/
	@$(AGENT_RULES)/bin/agent-rules sync "$(CURDIR)"

rules-check: ## Show what `make rules` would change (exit 1 if anything)
	@$(AGENT_RULES)/bin/agent-rules check "$(CURDIR)"

##@ Release

# The version is the latest git tag (vX.Y.Z). package.json carries a copy because npm needs
# one; `make release` writes it from the tag, so it is never edited by hand.
version: ## Show the version: the latest git tag, and whether package.json agrees
	@tag=$$(git describe --tags --match 'v*' --dirty 2>/dev/null || echo none); \
	 pkg=$$(node -p "require('./package.json').version"); \
	 echo "git tag:      $$tag"; echo "package.json: $$pkg"; \
	 case "$$tag" in "v$$pkg"|"v$$pkg-dirty") ;; *) echo "(they differ: commits since the tag, or a tag not cut by make release)";; esac

release: ## Cut a release: BUMP=major|minor|patch from the latest tag; commits package.json and tags it (does not push)
	@test -n "$(BUMP)" || { echo "Usage: make release BUMP=major|minor|patch"; exit 1; }
	@test -z "$$(git status --porcelain)" || { echo "The working tree is not clean: commit or stash first"; exit 1; }
	@latest=$$(git describe --tags --abbrev=0 --match 'v*' 2>/dev/null | sed 's/^v//'); \
	 test -n "$$latest" || { echo "There is no version tag yet: tag the first release with git tag -a v<x.y.z>"; exit 1; }; \
	 next=$$(echo "$$latest" | awk -F. -v bump="$(BUMP)" '{ if (bump == "major") printf "%d.0.0", $$1 + 1; else if (bump == "minor") printf "%d.%d.0", $$1, $$2 + 1; else if (bump == "patch") printf "%d.%d.%d", $$1, $$2, $$3 + 1 }'); \
	 test -n "$$next" || { echo "BUMP must be major, minor or patch"; exit 1; }; \
	 npm version "$$next" --no-git-tag-version --allow-same-version >/dev/null && \
	 git add package.json package-lock.json && \
	 git commit -q -m "Release v$$next" && \
	 git tag -a "v$$next" -m "Volta $$next" && \
	 echo "Tagged v$$next on $$(git rev-parse --short HEAD). Push with: git push origin HEAD v$$next"

##@ Help

help: ## Show this help, grouped by category
	@awk 'BEGIN { FS = ":.*## " } \
		/^##@/ { printf "\n%s\n", substr($$0, 5) } \
		/^[a-zA-Z_-]+:.*## / { printf "  %-13s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

.PHONY: setup install all up down running open dev start run build build-prod bundle build-app watch watch-app docker-build test lint clean rules rules-check version release help tokens
