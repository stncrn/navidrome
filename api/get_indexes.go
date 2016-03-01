package api

import (
	"github.com/astaxie/beego"
	"github.com/deluan/gosonic/repositories"
	"github.com/deluan/gosonic/utils"
	"github.com/karlkfi/inject"
	"github.com/deluan/gosonic/api/responses"
)

type GetIndexesController struct {
	beego.Controller
	repo repositories.ArtistIndex
}

func (c *GetIndexesController) Prepare() {
	inject.ExtractAssignable(utils.Graph, &c.repo)
}

func (c *GetIndexesController) Get() {
	indexes, err := c.repo.GetAll()
	if err != nil {
		beego.Error("Error retrieving Indexes:", err)
		c.CustomAbort(200, string(responses.NewError(responses.ERROR_GENERIC, "Internal Error")))
	}
	res := &responses.ArtistIndex{IgnoredArticles: beego.AppConfig.String("ignoredArticles")}
	res.Index = make([]responses.IdxIndex, len(indexes))
	for i, idx := range indexes {
		res.Index[i].Name = idx.Id
		res.Index[i].Artists = make([]responses.IdxArtist, len(idx.Artists))
		for j, a := range idx.Artists {
			res.Index[i].Artists[j].Id = a.ArtistId
			res.Index[i].Artists[j].Name = a.Artist
		}
	}

	c.Ctx.Output.Body(responses.NewXML(res))
}