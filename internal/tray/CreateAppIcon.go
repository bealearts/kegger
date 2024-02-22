package tray

import (
	"errors"
	"os"
	"path/filepath"

	"fyne.io/fyne/v2"
	"github.com/bealearts/kegger/internal/brew"
	"howett.net/plist"
)

func CreateAppIcon(appInfo *brew.AppInfo) (fyne.Resource, error) {
	appPath, err := getAppPath(appInfo)
	if err != nil {
		return nil, err
	}

	return getAppIcon(appPath)
}

func getAppPath(appInfo *brew.AppInfo) (string, error) {
	for _, artifact := range appInfo.Artifacts {
		if len(artifact.App) != 0 {
			return "/Applications/" + artifact.App[0], nil
		}
		if len(artifact.Pkg) != 0 {
			fileName := artifact.Pkg[0]
			return "/Applications/" + fileName[:len(fileName)-len(filepath.Ext(fileName))] + ".app", nil
		}
	}

	return "", errors.New("application path not found")
}

func getAppIcon(appPath string) (fyne.Resource, error) {
	iconPath, err := readPListCFBundleIconFile(appPath)
	if err != nil {
		return nil, err
	}

	icon, err := fyne.LoadResourceFromPath(filepath.Join(appPath, iconPath))
	if err != nil {
		return nil, err
	}
	return icon, nil
}

func readPListCFBundleIconFile(appPath string) (string, error) {
	file, err := os.Open(appPath + "/Contents/Info.plist")
	if err != nil {
		return "", err
	}
	defer file.Close()

	type sparseBundle struct {
		CFBundleIconFile string `plist:"CFBundleIconFile"`
	}

	decoder := plist.NewDecoder(file)
	var data sparseBundle
	err = decoder.Decode(&data)
	if err != nil {
		return "", err
	}
	return "/Contents/Resources/" + data.CFBundleIconFile, err
}
