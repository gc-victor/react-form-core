BINDIR=node_modules/.bin
LINT_STAGED=$(BINDIR)/lint-staged
MICROBUNDLE=$(BINDIR)/microbundle
STORYBOOK_BUILD=$(BINDIR)/build-storybook
STORYBOOK_START=$(BINDIR)/start-storybook
TSLINT=$(BINDIR)/tslint
JEST=$(BINDIR)/jest
VERSION=$(shell node -p -e 'require("./package.json").version')

help :
	@echo "Available commands:"
	@echo ""
	@echo "  make dist\t\tbuild dist (e.g. 'make dist')"
	@echo "  make format\t\tformat (e.g. 'make format')"
	@echo "  make lint\t\tlint (e.g. 'make lint')"
	@echo "  make lint-staged\texecute lint-staged"
	@echo "  make release-minor\trelease a new minor version"
	@echo "  make release-major\trelease a new major version"
	@echo "  make story\t\tstart storybook"
	@echo "  make story-build\tbuild storybook"
	@echo ""

dist :
	$(MICROBUNDLE) build --jsx --name react-from-core || exit $? ; \
	([ $$? -eq 0 ] && echo "✓ Builded distribution files" || exit 1) ;\

format :
	$(BINDIR)/prettier --write "src/**/*.ts" ;\

lint :
	$(TSLINT) --fix --config tslint.json --project tsconfig.json || exit $? ; \
	echo "✓ Lint passed" ;\

lint-staged:
	$(LINT_STAGED)

release :
	git add -A || exit $? ;\
	git commit -m 'release: $(VERSION)' || exit $? ;\
	git push origin master || exit $? ;\
	git tag $(VERSION) || exit $? ;\
	git push --tags || exit $? ;\
	npm publish || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released $(VERSION)" || exit 1) ;\

release-minor :
	make dist || exit $? ;\
	npm version minor || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new minor $(VERSION)" || exit 1) ;\

release-major :
	make test || exit $? ;\
	make dist || exit $? ;\
	npm version major || exit $? ;\
	make release || exit $? ;\
	([ $$? -eq 0 ] && echo "✓ Released new major $(VERSION)" || exit 1) ;\

story :
	${STORYBOOK_START} -p 9001 -c .storybook ;\

story-build :
	${STORYBOOK_BUILD} -c .storybook -o build-storybook/ ;\

test :
	$(JEST) ;\

test-watch :
	$(JEST) --watchAll ;\

# catch anything and do nothing
%:
	@:
