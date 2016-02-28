package models

import (
	"time"
)

type MediaFile struct {
	Id          string
	Path        string
	Title       string
	Album       string
	Artist      string
	AlbumArtist string
	Compilation bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (m*MediaFile) RealArtist() string {
	if (m.Compilation) {
		return "Various Artists"
	}
	if (m.AlbumArtist != "") {
		return m.AlbumArtist
	}
	return m.Artist
}