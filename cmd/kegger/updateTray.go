package main

import (
	"fmt"
	"strconv"
	"strings"
	"sync"

	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/sqweek/dialog"
)

var updateMutex sync.Mutex

func updateTray() {
	updateMutex.Lock()
	defer updateMutex.Unlock()

	Logger.Info("Performing update check")
	updates, pinned, err := brew.CheckForUpdates()
	if err != nil {
		Logger.Error(err)
		return
	}

	count := len(updates)
	if count == 1 {
		updatesMenu.Label = "1 Update Available"
	} else {
		updatesMenu.Label = fmt.Sprintf("%+v Updates Available", count)
	}
	Logger.Info(strconv.Itoa(count), " updates found")

	items := make([]*fyne.MenuItem, 0, len(updates)+len(pinned)+1)
	for _, update := range updates {
		label := fmt.Sprintf("%v (%v) -> %v", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version)
		name := update.Name
		item := fyne.NewMenuItem(label, func() {
			brew.ExecUpdate(name)
		})

		items = append(items, item)
	}

	if len(pinned) > 0 {
		items = append(items, fyne.NewMenuItemSeparator())

		for _, update := range pinned {
			label := fmt.Sprintf("%v (%v) -> %v [Pinned at %v]", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version, update.Pinned_Version)
			name := update.Name
			item := fyne.NewMenuItem(label, func() {
				if dialog.Message("Are you sure you want to update pinned item?\n\n%v", label).Title("Updated Pinned").YesNo() {
					brew.ExecBrew("unpin", name)
					brew.ExecUpdate(name)
				}
			})

			items = append(items, item)
		}
	}

	updatesMenu.ChildMenu = fyne.NewMenu("", items...)

	if count == 0 {
		if icon != nil {
			desk.SetSystemTrayIcon(icon)
		}
		updateAllMenu.Disabled = true
		if len(pinned) == 0 {
			updatesMenu.Disabled = true
		} else {
			updatesMenu.Disabled = false
		}
	} else {
		if icon != nil {
			desk.SetSystemTrayIcon(redIcon)
		}
		updateAllMenu.Disabled = false
		updatesMenu.Disabled = false
	}

	menu.Refresh()

	enrichMenu(updates, pinned, updatesMenu, menu)
}
