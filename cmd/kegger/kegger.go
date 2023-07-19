package main

import (
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/tray"
	"github.com/getlantern/systray"
)

func main() {
	defer Logger.Sync()

	Logger.Info("Starting")
	systray.Run(onReady, onExit)
}

func onReady() {
	icon, icon2x := tray.CreateTrayIcons()
	systray.SetTemplateIcon(icon2x, icon)
	systray.SetTooltip("Kegger - Join the party")

	tray.CreateTrayMenu()
}

func onExit() {
	Logger.Info("Stopping")
}
