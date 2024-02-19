package brew

import (
	"fmt"
	"os"

	. "github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/util"
)

func ExecUpdate(name string) {
	Logger.Info("Executing an Update")
	err := util.ExecTerminalScript(createScript(name))
	if err != nil {
		Logger.Error(err)
	}
}

func createScript(name string) string {
	return fmt.Sprintf(`#!/bin/bash
  clear
  echo Kegger - Join the party
  echo
  brew upgrade %v
  kill -SIGUSR2 %v > /dev/null 2>&1 # Trigger Refresh
  echo
  echo Updated Finished - There may be Errors or further instructions listed above
  read -n 1 -s -r -p "Press any key to close"`, name, os.Getpid())
}
