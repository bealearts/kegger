package brew

import (
	"os/exec"
)

func ExecBrew(args ...string) (string, error) {
	cmd := exec.Command("/usr/local/bin/brew", args...)
	bytes, err := cmd.Output()

	if err != nil {
		return "", err
	}

	return string(bytes[:]), nil
}
