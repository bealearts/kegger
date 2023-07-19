package tray

import (
	"os"

	. "github.com/bealearts/kegger/internal/logger"
)

func CreateTrayIcons() ([]byte, []byte) {
	bytes, err := os.ReadFile("./assets/kegTemplate.png")
	if err != nil {
		Logger.Error(err)
		bytes = make([]byte, 1)
	}

	bytes2, err2 := os.ReadFile("./assets/kegTemplate@2x.png")
	if err2 != nil {
		Logger.Error(err2)
		bytes2 = bytes
	}

	return bytes, bytes2
}
