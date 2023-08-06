package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/fyne-io/terminal"
)

func main() {
	defer Logger.Sync()

	ap := app.New()

	if desk, ok := ap.(desktop.App); ok {
		if icon, err := fyne.LoadResourceFromPath("./assets/kegTemplate@2x.png"); err == nil {
			desk.SetSystemTrayIcon(icon)
		}

		w := ap.NewWindow("Clean up Celler")
		w.Resize(fyne.NewSize(50, 50))
		term := terminal.New()
		term.Resize(fyne.NewSize(50, 50))
		w.SetContent((term))

		m := fyne.NewMenu("Kegger",
			fyne.NewMenuItem("Clean up Celler", func() {
				w.Show()
				term.RunLocalShell()
			}),
			fyne.NewMenuItemSeparator(),
			fyne.NewMenuItem("About", func() {
				Logger.Info("Hi")
				term.Write([]byte("ls -al\n"))
			}),
		)
		desk.SetSystemTrayMenu(m)
	}

	Logger.Info("Starting")
	ap.Run()
}
