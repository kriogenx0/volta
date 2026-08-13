.DEFAULT_GOAL := start

DOCKER_IMAGE ?= volta-styleguide
STYLEGUIDE_PORT ?= 8888

# One-time (or as-needed) project setup: install npm dependencies.
setup:
	npm install

# Kept as an alias for setup, for anyone used to the old target name.
install: setup

# Builds the component library + styleguide app, then serves the styleguide
start: setup
	npm start

# Vite dev server with HMR. Does NOT run setup -- run `make setup` yourself
# first if node_modules isn't installed yet, so day-to-day `make dev` stays fast.
dev:
	npm run dev

# Dependencies are installed while building the styleguide image.
run:
	npm run dev

build: setup
	npm run build

build-app: setup
	npm run build-app

watch: setup
	npm run watch

watch-app: setup
	npm run watch-app

test: setup
	npm test

lint: setup
	npm run lint

docker-build:
	docker build -f styleguide/Dockerfile -t $(DOCKER_IMAGE) .

docker-run: docker-build
	docker run --rm -p $(STYLEGUIDE_PORT):8888 $(DOCKER_IMAGE)

clean:
	rm -rf components/compiled public/compiled styleguide/dist node_modules/.cache

help:
	@echo "Available targets:"
	@echo "  setup       Install npm dependencies"
	@echo "  install     Alias for setup"
	@echo "  start       Build components, then serve the styleguide (default)"
	@echo "  dev         Vite dev server for the styleguide, with HMR (run 'make setup' first)"
	@echo "  run         Start the styleguide without installing dependencies"
	@echo "  build       Build the component library bundle"
	@echo "  build-app   Build the styleguide app bundle"
	@echo "  watch       Rebuild the component library on change"
	@echo "  watch-app   Rebuild the styleguide app on change"
	@echo "  test        Run the test suite"
	@echo "  lint        Lint components/"
	@echo "  docker-build  Build the styleguide Docker image"
	@echo "  docker-run    Build and run the styleguide in Docker on port $(STYLEGUIDE_PORT)"
	@echo "  clean       Remove build artifacts (compiled/, node_modules/.cache)"

.PHONY: setup install start dev run build build-app watch watch-app test lint docker-build docker-run clean help
