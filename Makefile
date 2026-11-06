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

##@ Help

help: ## Show this help, grouped by category
	@awk 'BEGIN { FS = ":.*## " } \
		/^##@/ { printf "\n%s\n", substr($$0, 5) } \
		/^[a-zA-Z_-]+:.*## / { printf "  %-13s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

.PHONY: setup install all up down running dev start run build build-prod build-app watch watch-app docker-build test lint tokens clean rules rules-check help
