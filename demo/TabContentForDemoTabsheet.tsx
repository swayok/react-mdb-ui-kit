import React from 'react'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import TabSheetTabContent from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabContent'

interface Props {
    name: string
    children: React.ReactNode | React.ReactNode[]
    single?: boolean
}

export default function TabContentForDemoTabsheet(props: Props) {
    return (
        <TabSheetTabContent
            name={props.name}
            lazy
        >
            <div className="row">
                <div className={props.single ? 'col-12' : 'col-6'}>
                    <Card>
                        <CardBody>
                            {props.children}
                        </CardBody>
                    </Card>
                </div>
                {!props.single && (
                    <div className="col-6 pt-4">
                        {props.children}
                    </div>
                )}
            </div>
        </TabSheetTabContent>
    )
}
