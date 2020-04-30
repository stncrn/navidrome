import React, { cloneElement } from 'react'
import { Button, sanitizeListRestProps, TopToolbar,ExportButton } from 'react-admin'
import {
  useDataProvider,
  useTranslate
} from 'react-admin'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import { useDispatch, useSelector } from 'react-redux'

const SongListActions = ({
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  filterValues,
  permanentFilter,
  exporter,
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  maxResults,
  total,
  ids,
  ...rest
}) => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
        <ExportButton
          disabled={total === 0}
          resource={resource}
          sort={currentSort}
          filter={{ ...filterValues, ...permanentFilter }}
          exporter={exporter}
          maxResults={Number.MAX_SAFE_INTEGER}
          label={translate('resources.song.bulk.shuffleAll')}
          icon={<ShuffleIcon fontSize="inherit" />}
        />
    </TopToolbar>
  )
}

SongListActions.defaultProps = {
  selectedIds: [],
  onUnselectItems: () => null,
}

export default SongListActions
