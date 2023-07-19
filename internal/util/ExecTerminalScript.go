package util

import (
	"os/exec"
)

func ExecTerminalScript(script string) error {
	cmd := exec.Command("open", "-b", "com.apple.terminal", script)
	_, err := cmd.Output()

	return err
}
