import {UILayout} from '../types/Common'

export default function detectUiLayout(): UILayout {
    let layout: UILayout
    if (window.innerWidth < 350) {
        layout = {
            deviceType: 'mobile',
            isWide: false,
            bootstrapSize: 'xxs',
        }
    } else if (window.innerWidth < 576) {
        layout = {
            deviceType: 'mobile',
            isWide: false,
            bootstrapSize: 'xs',
        }
    } else if (window.innerWidth < 768) {
        layout = {
            deviceType: 'mobile',
            isWide: true,
            bootstrapSize: 'sm',
        }
    } else if (window.innerWidth < 992) {
        layout = {
            deviceType: 'tablet',
            isWide: false,
            bootstrapSize: 'md',
        }
    } else if (window.innerWidth < 1200) {
        layout = {
            deviceType: 'tablet',
            isWide: true,
            bootstrapSize: 'lg',
        }
    } else if (window.innerWidth < 1400) {
        layout = {
            deviceType: 'desktop',
            isWide: false,
            bootstrapSize: 'xl',
        }
    } else {
        layout = {
            deviceType: 'desktop',
            isWide: true,
            bootstrapSize: 'xxl',
        }
    }
    console.log(`[detectUiLayout] ${window.innerWidth}x${window.innerHeight} => ${JSON.stringify(layout)}`)
    return layout
}
