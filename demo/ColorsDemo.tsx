import React from 'react'
import {SectionDivider} from '../components/SectionDivider'
import {TabSheet} from '../components/TabSheet/TabSheet'
import TabSheetBody from '../components/TabSheet/TabSheetBody'
import TabSheetHeader from '../components/TabSheet/TabSheetHeader'
import TabSheetTabButton from '../components/TabSheet/TabSheetTabButton'
import {ColorPaletteDemo} from './groups/ColorPaletteDemo'
import {TabContentForDemoTabsheet} from './TabContentForDemoTabsheet'

const palettes: string[] = [
    'gray',
    'blue',
    'indigo',
    'purple',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'cyan',
    'deep-purple',
    'light-blue',
    'light-green',
    'lime',
    'amber',
    'deep-orange',
    'brown',
    'blue-gray',
]

// Демонстрация цветовых палитр.
export function ColorsDemo() {

    return (
        <TabSheet
            defaultTab="palettes"
            tag="div"
            savesStateToUrlQuery
            urlQueryArgName="colors"
        >
            <TabSheetHeader>
                <TabSheetTabButton name="palettes">
                    Palettes
                </TabSheetTabButton>
                <TabSheetTabButton name="test-palette">
                    Test palette
                </TabSheetTabButton>
            </TabSheetHeader>
            <TabSheetBody>
                <TabContentForDemoTabsheet
                    name="palettes"
                    single
                >
                    <SectionDivider
                        label="Primary colors"
                        labelClassName="text-blue"
                        margins="none"
                        className="mb-3"
                    />
                    <ColorPaletteDemo
                        color="primary-colors"
                        variants={[
                            'primary',
                            'secondary',
                            'success',
                            'info',
                            'warning',
                            'danger',
                            'light',
                            'dark',
                        ]}
                    />
                    {palettes.map(color => (
                        <div key={color}>
                            <SectionDivider
                                label={color[0].toUpperCase() + color.slice(1) + ' palette'}
                                labelClassName="text-blue"
                            />
                            <ColorPaletteDemo color={color} />
                        </div>
                    ))}
                </TabContentForDemoTabsheet>
                <TabContentForDemoTabsheet
                    name="test-palette"
                    single
                >
                    <ColorPaletteDemo color="test" />
                    <SectionDivider
                        label="Camparison"
                        labelClassName="text-blue"
                    />
                    <ColorPaletteDemo
                        color="test-compare"
                        accents={[]}
                    />
                </TabContentForDemoTabsheet>
            </TabSheetBody>
        </TabSheet>
    )
}
