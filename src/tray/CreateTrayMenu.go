package tray

import (
	"fmt"

	"github.com/getlantern/systray"
)

func CreateTrayMenu() {

	mClean := systray.AddMenuItem("Clean up Celler", "")
	go func() {
		<-mClean.ClickedCh
		fmt.Println("Clean")
		//dialogs.ShowAboutDialog("About", "Kegger", nil)
	}()

	systray.AddSeparator()

	// mPref

	mAbout := systray.AddMenuItem("About", "")
	go func() {
		<-mAbout.ClickedCh
		fmt.Println("About")
		//dialogs.ShowAboutDialog("About", "Kegger", nil)
	}()

	systray.AddSeparator()

	mQuit := systray.AddMenuItem("Quit", "")
	go func() {
		<-mQuit.ClickedCh
		fmt.Println("Quit")
		systray.Quit()
	}()
}
