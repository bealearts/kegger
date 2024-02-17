package main

import (
	"fmt"
	"strings"

	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
)

func updateTray() {
	Logger.Info("Performing update check")
	updates, err := brew.CheckForUpdates()
	if err != nil {
		Logger.Error(err)
		return
	}

	count := brew.UpdatableCount(updates)
	if count == 1 {
		updatesMenu.Label = "1 Update Available"
	} else {
		updatesMenu.Label = fmt.Sprintf("%+v Updates Available", count)
	}

	items := make([]*fyne.MenuItem, len(updates))
	for index, update := range updates {
		label := fmt.Sprintf("%v (%v) -> %v", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version)
		name := update.Name
		item := fyne.NewMenuItem(label, func() {
			brew.ExecUpdate(name)
		})

		items[index] = item
	}
	updatesMenu.ChildMenu = fyne.NewMenu("", items...)

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

	menu.Refresh()

	go enrichMenu(&updates, updatesMenu, menu)
}
