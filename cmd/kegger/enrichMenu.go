package main

import (
	"fmt"
	"strings"
	"sync"

	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/tray"
)

func enrichMenu(updates *[]brew.Update, updatesMenu *fyne.MenuItem, menu *fyne.Menu) {
	Logger.Info("Enriching Updates Menu")

	var wg sync.WaitGroup

	for index, update := range *updates {
		if update.IsCask {
			wg.Add(1)

			// TODO: cache
			go func(update brew.Update, index int) {
				defer wg.Done()

				appInfo, err := brew.GetAppInfo(update.Name)
				if err != nil {
					Logger.Warn(update.Name, " ", err)
					return
				}

				if len(appInfo.Name) != 0 {
					// Use App Info Name
					updatesMenu.ChildMenu.Items[index].Label = fmt.Sprintf("%v (%v) -> %v", appInfo.Name[0], strings.Join(update.Installed_Versions, ","), update.Current_Version)
				}

				if len(appInfo.Artifacts) != 0 {
					icon, err := tray.CreateAppIcon(appInfo)
					if err != nil {
						Logger.Warn(update.Name, " ", err)
						return
					}
					updatesMenu.ChildMenu.Items[index].Icon = icon
				}
			}(update, index)

		}
	}

	wg.Wait()
	menu.Refresh()
}
