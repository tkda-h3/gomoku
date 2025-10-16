.PHONY: help generate-client clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

generate-client: ## Generate TypeScript client from OpenAPI spec
	npx openapi-typescript-codegen --input ./openapi.yaml --output ./generated-client --client axios

clean: ## Remove generated client code
	rm -rf ./generated-client
