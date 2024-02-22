package brew

import (
	"os"
	"os/exec"
	"runtime"
)

func ExecBrew(args ...string) (string, error) {
	var bin string = "/opt/homebrew/bin/brew"
	if runtime.GOARCH == "amd64" {
		bin = "/usr/local/bin/brew" // "Old" path
	}

	cmd := exec.Command(bin, args...)
	cmd.Env = os.Environ()
	bytes, err := cmd.Output()

	if err != nil {
		return "", err
	}

	return string(bytes[:]), nil
}
