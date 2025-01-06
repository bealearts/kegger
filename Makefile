.PHONY: start build clean all

start:
	go install github.com/bokwoon95/wgo@latest
	wgo go run cmd/kegger/*.go

build:
	go install fyne.io/fyne/v2/cmd/fyne@latest
	mkdir -p build
	fyne package -os darwin --src cmd/kegger --release
	mv kegger.app build/kegger.app
	mkdir -p build/kegger.app/Contents/MacOS/assets
	cp assets/*.png build/Kegger.app/Contents/MacOS/assets
	hdiutil create -volname Kegger -srcfolder build/ -ov -format UDZO build/Kegger.dmg
	shasum --algorithm 256 build/Kegger.dmg

clean:
	rm -rf build

update:
	go get -u ./...
	go mod tidy

all: clean build
