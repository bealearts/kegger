package main

import (
	"fmt"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/sqweek/dialog"
)

// var icon, icon2x = tray.CreateTrayIcons()
var menu *fyne.Menu
var updatesMenu *fyne.MenuItem
var updateAllMenu *fyne.MenuItem

func main() {
	defer Logger.Sync()

	ap := app.New()

	if desk, ok := ap.(desktop.App); ok {
		if icon, err := fyne.LoadResourceFromPath("./assets/kegTemplate@2x.png"); err == nil {
			desk.SetSystemTrayIcon(icon)
		}

		menu, updatesMenu, updateAllMenu = createTrayMenu()
		desk.SetSystemTrayMenu((menu))
	}

	Logger.Info("Starting")

	ticker := time.NewTicker(time.Hour)
	go func() {
		<-ticker.C
		updateTray()
	}()

	go updateTray()

	ap.Run()
}

func createTrayMenu() (*fyne.Menu, *fyne.MenuItem, *fyne.MenuItem) {
	var menu *fyne.Menu
	updatesMenu := fyne.NewMenuItem("0 Updates", func() {})
	updatesMenu.Disabled = true
	//updatesMenu.ChildMenu = fyne.NewMenu("", fyne.NewMenuItem("Test", func() {}))

	updateAllMenu := fyne.NewMenuItem("Update All", func() {})
	updateAllMenu.Disabled = true

	menuItems := []*fyne.MenuItem{
		updatesMenu,
		updateAllMenu,
		fyne.NewMenuItem("Clean up Celler", func() {
			Logger.Info("Clean up Celler")
			// updatesMenu.ChildMenu.Items = []*fyne.MenuItem{fyne.NewMenuItem("Changed", func() {

			// })}
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

func updateTray() {
	Logger.Info("Performing update check")
	updates, err := brew.CheckForUpdates()
	if err != nil {
		Logger.Error(err)
		return
	}

	fmt.Printf("%+v\n", updates)
	count := brew.UpdatableCount(updates)
	if count == 1 {
		updatesMenu.Label = "1 Update Available"
	} else {
		updatesMenu.Label = fmt.Sprintf("%+v Updates Available", count)
	}

	if count == 0 {
		//systray.SetTemplateIcon(icon2x, icon)
		updateAllMenu.Disabled = true
		updatesMenu.Disabled = true
	} else {
		//systray.SetIcon(icon2x)
		updateAllMenu.Disabled = false
		updatesMenu.Disabled = false
	}

	// for _, update := range updates {
	// 	label := fmt.Sprintf("%v (%v) -> %v", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version)
	// 	menu.AddSubMenuItem(label, "")
	// }

	menu.Refresh()
}
