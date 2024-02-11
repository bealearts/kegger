.PHONY: start build

start:
	go install github.com/bokwoon95/wgo@latest
	wgo run cmd/kegger/kegger.go

build:
	go install fyne.io/fyne/v2/cmd/fyne@latest
	mkdir -p build
	fyne package -os darwin --src cmd/kegger
	mv Kegger.app build
	mkdir -p build/Kegger.app/Contents/Resources/assets
	cp assets/*.png build/Kegger.app/Contents/Resources/assets