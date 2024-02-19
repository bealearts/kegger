package main

import (
	"os"
	"os/signal"
	"syscall"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	. "github.com/bealearts/kegger/internal/logger"
)

var icon fyne.Resource
var redIcon fyne.Resource
var desk desktop.App
var menu *fyne.Menu
var updatesMenu *fyne.MenuItem
var updateAllMenu *fyne.MenuItem

func main() {
	defer Logger.Sync()

	Logger.Info("Starting")

	loadAssets()

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

	// Callback signal from the update script
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGUSR2)
	go func() {
		<-sigs
		updateTray()
	}()

	ap.Lifecycle().SetOnStarted(func() {
		go func() {
			time.Sleep(200 * time.Millisecond)
			setActivationPolicy()
			updateTray()
		}()
	})

	ap.Run()
}
