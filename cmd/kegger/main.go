package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	. "github.com/bealearts/kegger/internal/logger"
)

func main() {
	defer Logger.Sync()

	ap := app.New()

	if desk, ok := ap.(desktop.App); ok {
		if icon, err := fyne.LoadResourceFromPath("./assets/kegTemplate@2x.png"); err == nil {
			desk.SetSystemTrayIcon(icon)
		}

		m := fyne.NewMenu("Kegger",
			fyne.NewMenuItem("Clean up Celler", func() {
				Logger.Info("Hi")
			}),
			fyne.NewMenuItemSeparator(),
			fyne.NewMenuItem("About", func() {
				Logger.Info("Hi")
			}),
		)
		desk.SetSystemTrayMenu(m)
	}

	Logger.Info("Starting")
	ap.Run()
}
