package logger

import (
	"log"

	"go.uber.org/zap"
)

var Logger *zap.SugaredLogger = func() *zap.SugaredLogger {
	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatalf("Can't initialize zap logger: %v", err)
	}

	return logger.Sugar()
}()
