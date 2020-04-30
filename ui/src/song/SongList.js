import React from 'react'
import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  NumberField,
  SearchInput,
  TextField,
  useDataProvider,
} from 'react-admin'
import { useMediaQuery } from '@material-ui/core'
import {
  DurationField,
  Pagination,
  PlayButton,
  SimpleList,
  Title,
} from '../common'
import { useDispatch } from 'react-redux'
import {
  addTrack,
  addTracks,
  clearQueue,
  setTrack
} from '../audioplayer'
import AddIcon from '@material-ui/icons/Add'
import { SongBulkActions } from './SongBulkActions'
import SongListActions from './SongListActions'
import { AlbumLinkField } from './AlbumLinkField'
import { SongDetails } from '../common'

const SongFilter = (props) => (
  <Filter {...props}>
    <SearchInput source="title" alwaysOn />
  </Filter>
)

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const chunkArray = (arr, chunk_size) => {
  var r = [];
  while (arr.length) {
      r.push(arr.splice(0, chunk_size));
  }
  return r;
}

const SongList = (props) => {
  const dispatch = useDispatch()
  const isXsmall = useMediaQuery((theme) => theme.breakpoints.down('xs'))
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const dataProvider = useDataProvider()
  const shuffleAll = (songs) => {
    dispatch(clearQueue())
    const songIds = chunkArray(shuffle(songs.map(song => song.id)), 200)
    songIds.forEach((songIdChunk) => {
      dataProvider.getMany('song', { ids:songIdChunk }).then((response) => {
        dispatch(addTracks(response.data))
      })
    })
  }
  return (
    <List
      {...props}
      title={
        <Title subTitle={'resources.song.name'} args={{ smart_count: 2 }} />
      }
      sort={{ field: 'title', order: 'ASC' }}
      exporter={shuffleAll}
      bulkActionButtons={<SongBulkActions />}
      actions={<SongListActions />}
      filters={<SongFilter />}
      perPage={isXsmall ? 50 : 15}
      pagination={<Pagination />}
    >
      {isXsmall ? (
        <SimpleList
          primaryText={(r) => (
            <>
              <PlayButton action={setTrack(r)} />
              <PlayButton action={addTrack(r)} icon={<AddIcon />} />
              {r.title}
            </>
          )}
          secondaryText={(r) => r.artist}
          tertiaryText={(r) => <DurationField record={r} source={'duration'} />}
          linkType={(id, basePath, record) => dispatch(setTrack(record))}
        />
      ) : (
        <Datagrid
          expand={<SongDetails />}
          rowClick={(id, basePath, record) => dispatch(setTrack(record))}
        >
          <TextField source="title" />
          {isDesktop && <AlbumLinkField source="album" />}
          <TextField source="artist" />
          {isDesktop && <NumberField source="trackNumber" />}
          {isDesktop && <NumberField source="playCount" />}
          {isDesktop && (
            <FunctionField source="year" render={(r) => r.year || ''} />
          )}
          <DurationField source="duration" />
        </Datagrid>
      )}
    </List>
  )
}

export default SongList
