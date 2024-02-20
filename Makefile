.PHONY: start build build-amd64 build-arm64 clean all

start:
	go install github.com/bokwoon95/wgo@latest
	wgo go run cmd/kegger/*.go

build:
	go install fyne.io/fyne/v2/cmd/fyne@latest
	mkdir -p build/amd64/
	mkdir -p build/arm64/

build-amd64: build
	CGO_ENABLED=1 GOARCH=amd64 fyne package -os darwin --src cmd/kegger --name build/amd64/Kegger
	mkdir -p build/amd64/kegger.app/Contents/MacOS/assets
	cp assets/*.png build/amd64/Kegger.app/Contents/MacOS/assets
	hdiutil create -volname Kegger -srcfolder build/amd64/ -ov -format UDZO build/Kegger-amd64.dmg

build-arm64: build
	CGO_ENABLED=1 GOARCH=arm64 fyne package -os darwin --src cmd/kegger --name build/arm64/Kegger
	mkdir -p build/arm64/kegger.app/Contents/MacOS/assets
	cp assets/*.png build/arm64/Kegger.app/Contents/MacOS/assets
	hdiutil create -volname Kegger -srcfolder build/arm64/ -ov -format UDZO build/Kegger-arm64.dmg

clean:
	rm -rf build

all: clean build-amd64 build-arm64
