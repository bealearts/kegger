package brew

import (
	"github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/util"
)

var log = logger.Default()

func ExecCleanup() {
	err := util.ExecTerminalScript(script)
	if err != nil {
		log.Error(err)
	}
}

const script = `#!/bin/bash
clear
echo Kegger - Join the party
echo
brew cleanup
echo
echo Cleanup Finished - There may be Errors listed above
read -n 1 -s -r -p "Press any key to close"
`
