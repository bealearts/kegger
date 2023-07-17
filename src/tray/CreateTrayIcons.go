package tray

import (
	"fmt"
	"os"
)

func CreateTrayIcons() ([]byte, []byte) {
	bytes, err := os.ReadFile("./assets/kegTemplate.png")
	if err != nil {
		fmt.Println(err)
		bytes = make([]byte, 1)
	}

	bytes2, err2 := os.ReadFile("./assets/kegTemplate@2x.png")
	if err2 != nil {
		fmt.Println(err2)
		bytes2 = bytes
	}

	return bytes, bytes2
}
