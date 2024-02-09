package brew

import (
	"os/exec"
)

func ExecBrew(args ...string) (string, error) {
	cmd := exec.Command("brew", args...)
	bytes, err := cmd.Output()

	if err != nil {
		return "", err
	}

	return string(bytes[:]), nil
}
