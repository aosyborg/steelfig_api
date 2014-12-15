all:
	@echo "Running tests"
	@NODE_ENV=test mocha test --recursive
	$?

