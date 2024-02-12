.PHONY: start build

start:
	go install github.com/bokwoon95/wgo@latest
	wgo go run cmd/kegger/*.go

build:
	go install fyne.io/fyne/v2/cmd/fyne@latest
	mkdir -p build
	fyne package -os darwin --src cmd/kegger
	mv Kegger.app build
	mkdir -p build/Kegger.app/Contents/MacOS/assets
	cp assets/*.png build/Kegger.app/Contents/MacOS/assets
