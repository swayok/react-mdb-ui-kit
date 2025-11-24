import React from 'react'
import SectionDivider from '../../components/SectionDivider'

// Демонстрация заголовков.
export function HeadingsDemo() {
    return (
        <div>
            <h1>Top level heading (h1 tag)</h1>
            <div className="h1">Top level heading (.h1 class)</div>

            <SectionDivider/>
            <h2>Top level heading (h2 tag)</h2>
            <div className="h2">Top level heading (.h2 class)</div>

            <SectionDivider/>
            <h3>Top level heading (h3 tag)</h3>
            <div className="h3">Top level heading (.h3 class)</div>

            <SectionDivider/>
            <h4>Top level heading (h4 tag)</h4>
            <div className="h4">Top level heading (.h4 class)</div>

            <SectionDivider/>
            <h5>Top level heading (h5 tag)</h5>
            <div className="h5">Top level heading (.h5 class)</div>

            <SectionDivider/>
            <h6>Top level heading (h6 tag)</h6>
            <div className="h6">Top level heading (.h6 class)</div>
        </div>
    )
}
