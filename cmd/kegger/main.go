package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/sqweek/dialog"
)

func main() {
	defer Logger.Sync()

	var menu *fyne.Menu

	ap := app.New()

	if desk, ok := ap.(desktop.App); ok {
		if icon, err := fyne.LoadResourceFromPath("./assets/kegTemplate@2x.png"); err == nil {
			desk.SetSystemTrayIcon(icon)
		}

		mUpdates := fyne.NewMenuItem("0 Updates", func() {})
		mUpdates.ChildMenu = fyne.NewMenu("", fyne.NewMenuItem("Test", func() {

		}))

		menus := []*fyne.MenuItem{
			mUpdates,

			fyne.NewMenuItem("Clean up Celler", func() {
				mUpdates.ChildMenu.Items = []*fyne.MenuItem{fyne.NewMenuItem("Changed", func() {

				})}
				menu.Refresh()
			}),
			fyne.NewMenuItemSeparator(),
			fyne.NewMenuItem("About", func() {
				Logger.Info("Hi")
				dialog.Message("%s", "Do you want to continue?").Title("Are you sure?").Info()
			}),
		}

		menu = fyne.NewMenu("Kegger", menus...)
		desk.SetSystemTrayMenu(menu)
	}

	Logger.Info("Starting")
	ap.Run()
}
