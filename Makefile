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
		echo "You have to execute first 'make test-coverage'" ; \
	else \
		cd coverage ; \
		python -m SimpleHTTPServer 8000 ; \
	fi ;\

dist : ## Build distribution files
	rm -rf dist || exit $? ;\
	npx tsdx build || exit $? ; \

example :
	npx @dev-pack/dev-pack start ;\

format : ## Enforces a consistent style by parsing your code and re-printing it
	npx prettier --write "src/**/*.ts" ;\

lint : ## Linting utility
	npx eslint --fix ./src/**/*.ts* || exit $? ; \

lint-staged: ## Run linters against staged git files
	make dist || exit $? ; \
	npx lint-staged || exit $? ; \

release :
	git add -A || exit $? ;\
	git commit -m 'release: $(VERSION)' || exit $? ;\
	git push origin master || exit $? ;\
	git tag $(VERSION) || exit $? ;\
	git push --tags || exit $? ;\
	npm publish || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released $(VERSION)" || exit 1) ;\

release-beta :
	git add -A || exit $? ;\
	git commit -m 'release: $(VERSION)' || exit $? ;\
	git push origin master || exit $? ;\
	git tag $(VERSION) || exit $? ;\
	git push --tags || exit $? ;\
	npm publish --tag beta || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released $(VERSION)" || exit 1) ;\

release-minor : ## Release a new minor version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version minor || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new minor $(VERSION)" || exit 1) ;\

release-minor-beta : ## Release a new minor beta version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version minor || exit $? ;\
	make release-beta || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new minor $(VERSION)" || exit 1) ;\

release-major : ## Release a new major version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version major || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new major $(VERSION)" || exit 1) ;\

release-major-beta : ## Release a new major beta version
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version major || exit $? ;\
	make release-beta || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new major $(VERSION)" || exit 1) ;\

test : ## Execute tests
	npx jest || exit $? ;\

test-watch : ## Execute test and watch
	npx jest --watchAll ;\

test-watch-coverage : ## Execute test coverage and watch
	npx jest --watchAll --coverage=true ;\

test-coverage : ## Execute test coverage
	npx jest --coverage=true || exit $? ;\
	make coverage || exit $? ;\

watch : ## Execute dist and watch
	npx tsdx watch ; \

# catch anything and do nothing
%:
	@:
