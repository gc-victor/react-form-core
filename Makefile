.PHONY: coverage dist example
.DEFAULT_GOAL := help
ARG=$(filter-out $@,$(MAKECMDGOALS))
VERSION=$(shell node -p -e 'require("./package.json").version')

help: ## Show this help message
	@echo 'usage: make [target] <type> <name>'
	@echo
	@echo 'Targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

coverage :
	if [ ! -d "./coverage" ]; then \
		echo "You have to execute 'make test' or 'make test-watch'" ; \
	else \
		cd coverage ; \
		python -m SimpleHTTPServer 8000 ; \
	fi ;\

dist : ## Build distribution files
	rm -rf dist || exit $? ;\
	npx microbundle build --jsx --name reactFromCore || exit $? ; \
	([ $$? -eq 0 ] && echo "✓ Builded distribution files" || exit 1) ;\

example :
	make dist || exit $? ;\
	npx @dev-pack/dev-pack start ;\

format : ## Enforces a consistent style by parsing your code and re-printing it
	npx prettier --write "src/**/*.ts" ;\

lint : ## Linting utility
	npx tslint --fix --config tslint.json --project tsconfig.json || exit $? ; \
	echo "✓ Lint passed" ;\

lint-staged: ## Run linters against staged git files
	npx lint-staged

release :
	git add -A || exit $? ;\
	git commit -m 'release: $(VERSION)' || exit $? ;\
	git push origin master || exit $? ;\
	git tag $(VERSION) || exit $? ;\
	git push --tags || exit $? ;\
	npm publish || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released $(VERSION)" || exit 1) ;\

release-minor : ## Release a new minor version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version minor || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new minor $(VERSION)" || exit 1) ;\

release-major : ## Release a new major version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version major || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new major $(VERSION)" || exit 1) ;\

storybook : ## Start storybook
	npx start-storybook -p 9001 -c .storybook ;\

storybook-build : ## Build storybook
	npx build-storybook -c .storybook -o build-storybook/ ;\

test : ## Execute tests
	npx jest ;\

test-watch : ## Execute test and watch
	npx jest --watchAll ;\

watch : ## Execute dist and watch
	npx microbundle watch --jsx --name react-from-core ; \

# catch anything and do nothing
%:
	@:
