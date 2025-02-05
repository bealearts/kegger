package main

import (
	"fmt"
	"strings"
	"sync"

	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	"github.com/bealearts/kegger/internal/tray"
)

func enrichMenu(updates []*brew.Update, pinned []*brew.Update, updatesMenu *fyne.MenuItem, menu *fyne.Menu) {
	log.Info("Enriching Updates Menu")

	var wg sync.WaitGroup

	for index, update := range updates {
		if update.IsCask {
			wg.Add(1)

			// TODO: cache
			go enrich(&wg, *update, index)
		}
	}

	for index, update := range pinned {
		if update.IsCask {
			wg.Add(1)

			// TODO: cache
			go enrich(&wg, *update, len(updates)+index)
		}
	}

	wg.Wait()
	menu.Refresh()
}

func enrich(wg *sync.WaitGroup, update brew.Update, index int) {
	defer wg.Done()

	appInfo, err := brew.GetAppInfo(update.Name)
	if err != nil {
		log.Warn(update.Name, " ", err)
		return
	}

	if len(appInfo.Name) != 0 {
		// Use App Info Name
		updatesMenu.ChildMenu.Items[index].Label = fmt.Sprintf("%v (%v) -> %v", appInfo.Name[0], strings.Join(update.Installed_Versions, ","), update.Current_Version)
	}

	if len(appInfo.Artifacts) != 0 {
		icon, err := tray.CreateAppIcon(appInfo)
		if err != nil {
			log.Warn(update.Name, " ", err)
			return
		}
		updatesMenu.ChildMenu.Items[index].Icon = icon
	}
}
