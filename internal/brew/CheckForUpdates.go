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

func CheckForUpdates() ([]*Update, []*Update, error) {
	outdatedJSON, err := ExecBrew("outdated", "--json")

	if err != nil {
		return nil, nil, err
	}

	var outdated outdatedItems
	err = json.Unmarshal([]byte(outdatedJSON), &outdated)

	if err != nil {
		return nil, nil, err
	}

	updates := make([]*Update, 0, 20)
	pinned := make([]*Update, 0, 20)

	for index := range outdated.Casks {
		outdated.Casks[index].IsCask = true
		if outdated.Casks[index].Pinned {
			pinned = append(pinned, &outdated.Casks[index])
		} else {
			updates = append(updates, &outdated.Casks[index])
		}
	}

	for index := range outdated.Formulae {
		if outdated.Formulae[index].Pinned {
			pinned = append(pinned, &outdated.Formulae[index])
		} else {
			updates = append(updates, &outdated.Formulae[index])
		}
	}

	return updates, pinned, nil
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
