package tray

import (
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/getlantern/systray"
	"github.com/sqweek/dialog"
)

func CreateTrayMenu() (systray.MenuItem, systray.MenuItem) {

	mUpdates := systray.AddMenuItem("0 Updates Available", "")
	mUpdates.Disable()

	mUpdate := systray.AddMenuItem("Update All", "")
	mUpdates.Disable()
	go func() {
		<-mUpdate.ClickedCh
		Logger.Info("Update All")
		//brew.ExecCleanup()
	}()

	mClean := systray.AddMenuItem("Clean up Celler", "")
	go func() {
		<-mClean.ClickedCh
		Logger.Info("Clean")
		brew.ExecCleanup()
	}()

	systray.AddSeparator()

	// mPref

	mAbout := systray.AddMenuItem("About", "")
	go func() {
		<-mAbout.ClickedCh
		Logger.Info("About")
		dialog.Message("%s", "Kegger - Join the party").Title("About").Info()

	}()

	systray.AddSeparator()

	mQuit := systray.AddMenuItem("Quit", "")
	go func() {
		<-mQuit.ClickedCh
		Logger.Info("Quit")
		systray.Quit()
	}()

	return *mUpdates, *mUpdate
}
