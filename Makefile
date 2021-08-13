.PHONY: start build

start:
	deno run --allow-run --allow-read --watch src/main.js

build:
	mkdir -p build
	deno compile --allow-run --allow-read --output build/kegger src/main.js
	cp -r ./assets ./build/assets
	cp -r ./bin ./build/bin 
