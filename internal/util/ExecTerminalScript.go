package util

import (
	"os"
	"os/exec"
)

func ExecTerminalScript(script string) error {
	scriptFile, err := os.CreateTemp("", "kegger")
	if err != nil {
		return err
	}

	err = scriptFile.Chmod(0775)
	if err != nil {
		return err
	}

	_, err = scriptFile.WriteString(script)
	if err != nil {
		return err
	}
	scriptFile.Sync()

	cmd := exec.Command("open", "-b", "com.apple.terminal", scriptFile.Name())
	err = cmd.Run()

	return err
}
