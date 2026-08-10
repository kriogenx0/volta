.DEFAULT_GOAL := start

install:
	npm install

# Builds the component library + styleguide app, then serves the styleguide
start: install
	npm start

dev: install
	npm run dev

build: install
	npm run build

build-app: install
	npm run build-app

watch: install
	npm run watch

watch-app: install
	npm run watch-app

test: install
	npm test

lint: install
	npm run lint

clean:
	rm -rf components/compiled public/compiled node_modules/.cache

help:
	@echo "Available targets:"
	@echo "  install     Install npm dependencies"
	@echo "  start       Build components, then serve the styleguide (default)"
	@echo "  dev         Vite dev server for the styleguide, with HMR"
	@echo "  build       Build the component library bundle"
	@echo "  build-app   Build the styleguide app bundle"
	@echo "  watch       Rebuild the component library on change"
	@echo "  watch-app   Rebuild the styleguide app on change"
	@echo "  test        Run the test suite"
	@echo "  lint        Lint components/"
	@echo "  clean       Remove build artifacts (compiled/, node_modules/.cache)"

.PHONY: install start dev build build-app watch watch-app test lint clean help
