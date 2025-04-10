import React from 'react'
import {DropdownAlign, DropdownDropDirection} from './DropdownTypes'

export interface DropdownContextValue {
    align?: DropdownAlign;
    drop?: DropdownDropDirection;
    isRTL?: boolean;
}

export const DropdownContext = React.createContext<DropdownContextValue>({})
