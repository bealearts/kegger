package tray

import (
	"fmt"
	"strings"

	"github.com/bealearts/kegger/internal/brew"
	"github.com/getlantern/systray"
)

func UpdateDependenciesMenu(menu systray.MenuItem, updates []brew.Update, updateCount int) {
	if updateCount == 1 {
		menu.SetTitle("1 Update Available")
	} else {
		menu.SetTitle(fmt.Sprintf("%+v Updates Available", updateCount))
	}

	for _, update := range updates {
		label := fmt.Sprintf("%v (%v) -> %v", update.Name, strings.Join(update.Installed_Versions, ","), update.Current_Version)
		menu.AddSubMenuItem(label, "")
	}
}
