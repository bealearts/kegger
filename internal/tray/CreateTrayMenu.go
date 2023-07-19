package tray

import (
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/getlantern/systray"
)

func CreateTrayMenu() {

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
		//dialogs.ShowAboutDialog("About", "Kegger", nil)
	}()

	systray.AddSeparator()

	mQuit := systray.AddMenuItem("Quit", "")
	go func() {
		<-mQuit.ClickedCh
		Logger.Info("Quit")
		systray.Quit()
	}()
}
