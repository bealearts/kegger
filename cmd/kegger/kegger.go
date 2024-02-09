package main

import (
	"fmt"
	"time"

	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/tray"
	"github.com/getlantern/systray"
)

var icon, icon2x = tray.CreateTrayIcons()

func main() {
	defer Logger.Sync()

	Logger.Info("Starting")

	run()
}

func run() {
	systray.Run(onReady, onExit)
	systray.Run(onReady, onExit)
}

func onReady() {
	systray.SetTemplateIcon(icon2x, icon)
	systray.SetTooltip("Kegger - Join the party")

	var updatesMenu, updateAllMenu = tray.CreateTrayMenu()

	ticker := time.NewTicker(time.Hour)
	go func() {
		<-ticker.C
		updateTray(updatesMenu, updateAllMenu)
	}()

	updateTray(updatesMenu, updateAllMenu)
}

func onExit() {
	Logger.Info("Stopping")
}

func updateTray(updatesMenu systray.MenuItem, updateAllMenu systray.MenuItem) {
	Logger.Info("Performing update check")
	updates, err := brew.CheckForUpdates()
	if err != nil {
		Logger.Error(err)
		return
	}

	fmt.Printf("%+v\n", updates)
	count := brew.UpdatableCount(updates)

	if count == 0 {
		systray.SetTemplateIcon(icon2x, icon)
		updateAllMenu.Disable()
		updatesMenu.Disable()
	} else {
		systray.SetIcon(icon2x)
		updateAllMenu.Enable()
		updatesMenu.Enable()
	}

	tray.UpdateDependenciesMenu(updatesMenu, updates, count)
}
