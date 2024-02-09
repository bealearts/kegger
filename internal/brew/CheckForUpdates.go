package brew

import "encoding/json"

type Update struct {
	Name               string
	Pinned             bool
	IsCask             bool
	Installed_Versions []string
	Current_Version    string
	Pinned_Version     string
}

type outdatedItems struct {
	Formulae []Update
	Casks    []Update
}

func CheckForUpdates() ([]Update, error) {
	outdatedJSON, err := ExecBrew("outdated", "--json")

	if err != nil {
		return nil, err
	}

	var outdated outdatedItems

	jsonErr := json.Unmarshal([]byte(outdatedJSON), &outdated)

	if jsonErr != nil {
		return nil, jsonErr
	}

	for index := range outdated.Casks {
		outdated.Casks[index].IsCask = true
	}

	return append(outdated.Formulae, outdated.Casks...), nil
}

func UpdatableCount(updates []Update) int {
	var filtered []Update
	for _, update := range updates {
		if !update.Pinned {
			filtered = append(filtered, update)
		}
	}
	return len(filtered)
}
