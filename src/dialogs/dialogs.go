//go:build darwin

package dialogs

/*
#cgo CFLAGS: -mmacosx-version-min=13.0 -x objective-c
#cgo LDFLAGS: -framework Cocoa -mmacosx-version-min=13.0 -framework UniformTypeIdentifiers

#import <Cocoa/Cocoa.h>

#import <UniformTypeIdentifiers/UTType.h>
#import "dialogs.h"

static void showAboutBox(char* title, char *message, void *icon, int length) {

	// run on main thread
	dispatch_async(dispatch_get_main_queue(), ^{
		NSAlert *alert = [[NSAlert alloc] init];
		if (title != NULL) {
			[alert setMessageText:[NSString stringWithUTF8String:title]];
			free(title);
		}
		if (message != NULL) {
			[alert setInformativeText:[NSString stringWithUTF8String:message]];
			free(message);
		}
		if (icon != NULL) {
			NSImage *image = [[NSImage alloc] initWithData:[NSData dataWithBytes:icon length:length]];
			[alert setIcon:image];
		}
		[alert setAlertStyle:NSAlertStyleInformational];
		[alert runModal];
	});
}
*/
import "C"
import (
	"unsafe"
)

func ShowAboutDialog(title string, message string, icon []byte) {
	var iconData unsafe.Pointer
	if icon != nil {
		iconData = unsafe.Pointer(&icon[0])
	}
	C.showAboutBox(C.CString(title), C.CString(message), iconData, C.int(len(icon)))
}
