package brew

import (
	"encoding/json"
)

type Artifact struct {
	App []string
	Pkg []string
}

type AppInfo struct {
	Name      []string
	Artifacts []Artifact
}

type appInfoItems struct {
	Casks []AppInfo
}

func GetAppInfo(name string) (*AppInfo, error) {
	infoJSON, err := ExecBrew("info", "--json=v2", name)
	if err != nil {
		return nil, err
	}

	var appInfo appInfoItems
	err = json.Unmarshal([]byte(infoJSON), &appInfo)

	if err != nil {
		return nil, err
	}

	if len(appInfo.Casks) == 0 {
		return &AppInfo{}, nil
	}

	return &appInfo.Casks[0], nil
}
