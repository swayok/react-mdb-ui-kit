import React from 'react'
import Card from 'swayok-react-mdb-ui-kit/components/Card/Card'
import CardBody from 'swayok-react-mdb-ui-kit/components/Card/CardBody'
import TabSheetTabContent from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTabContent'

interface Props {
    name: string,
    children: React.ReactNode | React.ReactNode[]
}

export default function TabContentForDemoTabsheet(props: Props) {
    return (
        <TabSheetTabContent
            name={props.name}
            lazy
        >
            <div className="row">
                <div className="col-6">
                    <Card>
                        <CardBody>
                            {props.children}
                        </CardBody>
                    </Card>
                </div>
                <div className="col-6 pt-4">
                    {props.children}
                </div>
            </div>
        </TabSheetTabContent>
    )
}
