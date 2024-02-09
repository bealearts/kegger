package tray

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	. "github.com/bealearts/kegger/internal/logger"
)

var menu *fyne.Menu

func CreateTrayMenu() {
	//updatesMenu := fyne.NewMenuItem("0 Updates", func() {})

	// menuItems := []*fyne.MenuItem{
	// 	updatesMenu,

	// 	fyne.NewMenuItem("Clean up Celler", func() {
	// 		updatesMenu.ChildMenu.Items = []*fyne.MenuItem{fyne.NewMenuItem("Changed", func() {

	// 		})}
	// 		//menu.Refresh()
	// 	}),
	// 	fyne.NewMenuItemSeparator(),
	// 	fyne.NewMenuItem("About", func() {
	// 		Logger.Info("Hi")
	// 		//dialog.Message("%s", "Do you want to continue?").Title("Are you sure?").Info()
	// 	}),
	// }
	ap := app.New()
	// menu = fyne.NewMenu("Kegger", menuItems...)
	if desk, ok := ap.(desktop.App); ok {
		menu = fyne.NewMenu("Kegger")
		desk.SetSystemTrayMenu((menu))
	}
	Logger.Info("Starting")
	ap.Run()
	//return menu, updatesMenu

	// mUpdates := systray.AddMenuItem("0 Updates Available", "")
	// mUpdates.Disable()

	// mUpdate := systray.AddMenuItem("Update All", "")
	// mUpdates.Disable()
	// go func() {
	// 	<-mUpdate.ClickedCh
	// 	Logger.Info("Update All")
	// 	//brew.ExecCleanup()
	// }()

	// mClean := systray.AddMenuItem("Clean up Celler", "")
	// go func() {
	// 	<-mClean.ClickedCh
	// 	Logger.Info("Clean")
	// 	brew.ExecCleanup()
	// }()

	// systray.AddSeparator()

	// // mPref

	// mAbout := systray.AddMenuItem("About", "")
	// go func() {
	// 	<-mAbout.ClickedCh
	// 	Logger.Info("About")
	// 	dialog.Message("%s", "Kegger - Join the party").Title("About").Info()

	// }()

	// systray.AddSeparator()

	// mQuit := systray.AddMenuItem("Quit", "")
	// go func() {
	// 	<-mQuit.ClickedCh
	// 	Logger.Info("Quit")
	// 	systray.Quit()
	// }()

	// return *mUpdates, *mUpdate
}
