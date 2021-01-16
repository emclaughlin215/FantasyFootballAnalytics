import React from "react"

import { Intent, Text, Button, Tag } from "@blueprintjs/core"

import { LoadState } from "../utils/LoadState"
import { IChange } from "../index.d"


interface SuggestedChangesProps {
    comparePlayersDrawerOpen: CallableFunction,
    suggestedChanges: LoadState<IChange[]>,
}

export class SuggestedChanges extends React.PureComponent<SuggestedChangesProps> {
    constructor(props: SuggestedChangesProps) {
        super(props)
    }

    render() {
        return(
            <div className='transfer-list-container'>
                <div className='transfer-list-header'>
                    <Text>Actions</Text>
                    <Text>Player Out</Text>
                    <Text>Player In</Text>
                    <Text>Expected Points Gain</Text>
                    <Text>Transfer Cost</Text>
                </div>
                <div className='transfer-list'>
                    {this.props.suggestedChanges.type === 'loaded' && this.props.suggestedChanges.value.map((change) => {
                        return (
                        <div className='transfer'>
                            <Button className='transfer-compare-players-button' intent='primary' onClick={() => this.props.comparePlayersDrawerOpen(change.id_player_out, change.id_player_in)}> Compare Players </Button>
                            <Text>{change.web_name_player_out}</Text>
                            <Text>{change.web_name_player_in}</Text>
                            <Tag large round intent={change.points_gain >= 4 ? Intent.SUCCESS : change.points_gain >= 0 ? Intent.PRIMARY : Intent.WARNING}>{change.points_gain}</Tag>
                            <Tag large round intent={change.transfer_cost <= 0 ? Intent.SUCCESS : change.points_gain <= 0.5 ? Intent.PRIMARY : Intent.WARNING}>{change.transfer_cost}</Tag>
                        </div>
                    )
                    })}
                </div>
            </div>
        )
    }
}
