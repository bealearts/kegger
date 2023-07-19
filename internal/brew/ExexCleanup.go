package brew

import (
	. "github.com/bealearts/kegger/internal/logger"
	"github.com/bealearts/kegger/internal/util"
)

func ExecCleanup() {
	err := util.ExecTerminalScript(script)
	if err != nil {
		Logger.Error(err)
	}
}

const script = `#!/bin/bash
echo Kegger - Join the party
echo
brew cleanup
echo
echo Cleanup Finished - There may be Errors listed above
read -n 1 -s -r -p "Press any key to close"
`
