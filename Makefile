.PHONY: start build

start:
	deno run --allow-run --allow-read --allow-write --unstable --import-map=./src/import-map.json --watch src/main.js

build:
	mkdir -p build
	deno compile --allow-run --allow-read --allow-write --unstable --import-map=./src/import-map.json --output build/kegger src/main.js
	cp -r ./assets ./build/assets
	cp -r ./bin ./build/bin
