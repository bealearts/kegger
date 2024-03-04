package logger

import (
	"log"

	"go.uber.org/zap"
)

var logger *zap.SugaredLogger

func Default() *zap.SugaredLogger {
	if logger == nil {
		logger = New()
	}

	return logger
}

func New() *zap.SugaredLogger {
	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatalf("Can't initialize zap logger: %v", err)
	}

	return logger.Sugar()
}
