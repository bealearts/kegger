package util

import (
	"bytes"
	"image"
	"image/png"
	"log"
	"strconv"

	"fyne.io/fyne/v2"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/font"
	"golang.org/x/image/font/gofont/gomonobold"
	"golang.org/x/image/math/fixed"
)

func CreateImageWithCounter(sourceImage fyne.Resource, count int) (fyne.Resource, error) {
	img, _, err := image.Decode(bytes.NewReader((sourceImage).Content()))
	if err != nil {
		return nil, err
	}

	imgNRGBA := img.(*image.NRGBA)
	addCount(imgNRGBA, count)

	buffer := new(bytes.Buffer)
	err = png.Encode(buffer, imgNRGBA)
	if err != nil {
		return nil, err
	}

	return fyne.NewStaticResource("ImageWithCounter", buffer.Bytes()), nil
}

func addCount(img *image.NRGBA, count int) {
	text := strconv.Itoa(count)
	if count > 99 {
		text = ":("
	}

	gomonobold, err := truetype.Parse(gomonobold.TTF)
	if err != nil {
		log.Println(err)
		return
	}

	d := &font.Drawer{
		Dst: img,
		Src: image.White,
		Face: truetype.NewFace(gomonobold, &truetype.Options{
			Size:    20,
			DPI:     72,
			Hinting: font.HintingFull,
		}),
	}

	d.Dot = fixed.Point26_6{
		X: (fixed.I(28) - d.MeasureString(text)),
		Y: fixed.I(30),
	}
	d.DrawString(text)
}
