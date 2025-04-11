import React from 'react'
import {DropdownMenuOffset} from './DropdownTypes'
import {DropdownAlign, DropdownDropDirection} from './DropdownTypes'

export interface DropdownContextValue {
    align?: DropdownAlign
    drop?: DropdownDropDirection
    isRTL?: boolean
    offset?: DropdownMenuOffset
}

export const DropdownContext = React.createContext<DropdownContextValue>({})
