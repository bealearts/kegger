package main

import (
	"os"
	"path/filepath"
	"strings"

	"fyne.io/fyne/v2"
	. "github.com/bealearts/kegger/internal/logger"
)

func loadAssets() {
	cmdPath, _ := os.Executable()
	var err error

	if strings.Contains(os.Args[0], "/T/go-build") { // go run
		icon, err = fyne.LoadResourceFromPath("./assets/keg.png")
		if err != nil {
			Logger.Error(err)
		}
		redIcon, err = fyne.LoadResourceFromPath("./assets/kegRed.png")
		if err != nil {
			Logger.Error(err)
		}
	} else {
		icon, err = fyne.LoadResourceFromPath(filepath.Join(filepath.Dir(cmdPath), "./assets/keg.png"))
		if err != nil {
			Logger.Error(err)
		}
		redIcon, err = fyne.LoadResourceFromPath(filepath.Join(filepath.Dir(cmdPath), "./assets/kegRed.png"))
		if err != nil {
			Logger.Error(err)
		}
	}
}
