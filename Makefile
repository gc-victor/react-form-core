BINDIR=node_modules/.bin
JEST=$(BINDIR)/jest
LINT_STAGED=$(BINDIR)/lint-staged
MICROBUNDLE=$(BINDIR)/microbundle
PARCEL=$(BINDIR)/parcel
STORYBOOK_BUILD=$(BINDIR)/build-storybook
STORYBOOK_START=$(BINDIR)/start-storybook
TSLINT=$(BINDIR)/tslint
VERSION=$(shell node -p -e 'require("./package.json").version')

help :
	@echo "Available commands:"
	@echo ""
	@echo "  make dist\t\tbuild distribution files"
	@echo "  make format\t\tenforces a consistent style by parsing your code and re-printing it"
	@echo "  make lint\t\tlinting utility"
	@echo "  make lint-staged\trun linters against staged git files"
	@echo "  make release-minor\trelease a new minor version"
	@echo "  make release-major\trelease a new major version"
	@echo "  make story\t\tstart storybook"
	@echo "  make story-build\tbuild storybook"
	@echo "  make test\t\texecute tests"
	@echo "  make test-watch\texecute test and watch them"
	@echo ""

dist :
	$(MICROBUNDLE) build --jsx --name react-from-core || exit $? ; \
	([ $$? -eq 0 ] && echo "✓ Builded distribution files" || exit 1) ;\

.PHONY: example
example :
	mkdir dir ;\
	$(MICROBUNDLE) watch --jsx --name react-from-core | $(PARCEL) ./example/index.html --out-dir dist/example ;\

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

watch :
	$(MICROBUNDLE) watch --jsx --name react-from-core ; \

# catch anything and do nothing
%:
	@:
