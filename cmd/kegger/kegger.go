package main

import (
	"fmt"
	"strings"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/sqweek/dialog"
)

var icon, _ = fyne.LoadResourceFromPath("./assets/keg@2x.png")
var redIcon, _ = fyne.LoadResourceFromPath("./assets/kegTemplate@2x.png")

var desk desktop.App
var menu *fyne.Menu
var updatesMenu *fyne.MenuItem
var updateAllMenu *fyne.MenuItem

func main() {
	defer Logger.Sync()

	Logger.Info("Starting")

	ap := app.New()
	desk = ap.(desktop.App)

	if icon != nil {
		desk.SetSystemTrayIcon(icon)
	}

	menu, updatesMenu, updateAllMenu = createTrayMenu()
	desk.SetSystemTrayMenu((menu))

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

	updateAllMenu := fyne.NewMenuItem("Update All", func() {})
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
		if icon != nil {
			desk.SetSystemTrayIcon(icon)
		}
		updateAllMenu.Disabled = true
		updatesMenu.Disabled = true
	} else {
		if icon != nil {
			desk.SetSystemTrayIcon(redIcon)
		}
		updateAllMenu.Disabled = false
		updatesMenu.Disabled = false
	}

	items := make([]*fyne.MenuItem, count)
	for index, update := range updates {
		label := fmt.Sprintf("%v (%v) -> %v", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version)
		//name := update.Name
		item := fyne.NewMenuItem(label, func() {
			//brew.ExecUpdate(name)
		})
		items[index] = item
	}
	updatesMenu.ChildMenu = fyne.NewMenu("", items...)

	menu.Refresh()
}
