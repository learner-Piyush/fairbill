# FairBill Monorepo Makefile

ifeq ($(OS),Windows_NT)
	RUFF := api/.venv/Scripts/ruff.exe
	PYTEST := api/.venv/Scripts/pytest.exe
else
	RUFF := api/.venv/bin/ruff
	PYTEST := api/.venv/bin/pytest
endif

ifeq ($(wildcard $(RUFF)),)
	RUFF := ruff
	PYTEST := pytest
endif

.PHONY: check check-web check-api

check: check-web check-api

check-web:
	npm --prefix web run lint
	npm --prefix web run tsc
	npm --prefix web run test
	npm --prefix web run build

check-api:
	$(RUFF) check api
	$(RUFF) format --check api
	$(PYTEST) api
