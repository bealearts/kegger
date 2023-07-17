package main

import (
	"github.com/bealearts/kegger/tray"
	"github.com/getlantern/systray"
)

func main() {
	systray.Run(onReady, onExit)
}

func onReady() {
	icon, icon2x := tray.CreateTrayIcons()
	systray.SetTemplateIcon(icon2x, icon)
	systray.SetTooltip("Kegger - Join the party")

	tray.CreateTrayMenu()
}

func onExit() {
	// clean up here
}
