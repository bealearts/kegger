package main

import (
	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/sqweek/dialog"
)

func createTrayMenu() (*fyne.Menu, *fyne.MenuItem, *fyne.MenuItem) {
	var menu *fyne.Menu
	updatesMenu := fyne.NewMenuItem("0 Updates", func() {})
	updatesMenu.Disabled = true

	updateAllMenu := fyne.NewMenuItem("Update All", func() {
		Logger.Info("Update All")
		brew.ExecUpdate("")
	})
	updateAllMenu.Disabled = true

	menuItems := []*fyne.MenuItem{
		updatesMenu,
		updateAllMenu,
		fyne.NewMenuItem("Clean up Celler", func() {
			Logger.Info("Clean up Celler")
			brew.ExecCleanup()
		}),
		fyne.NewMenuItemSeparator(),
		// TODO: Prefs
		fyne.NewMenuItem("About", func() {
			Logger.Info("About")
			dialog.Message("%s", "Kegger").Title("About").Info()
		}),
	}

	menu = fyne.NewMenu("Kegger", menuItems...)

	return menu, updatesMenu, updateAllMenu
}
