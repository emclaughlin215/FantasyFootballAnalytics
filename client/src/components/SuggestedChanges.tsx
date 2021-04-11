import React from "react"

import { Text, Button } from "@blueprintjs/core"

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

        const { comparePlayersDrawerOpen } = this.props;
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
                    {this.props.suggestedChanges.type === 'loaded' && this.props.suggestedChanges.value.map((change, idx) => {
                        return (
                        <div className='transfer' key={idx}>
                            <Button className='transfer-compare-players-button' intent='primary' onClick={() => comparePlayersDrawerOpen(undefined, undefined, change.id_player_out, change.id_player_in)}> Compare Players </Button>
                            <Text>{change.web_name_player_out}</Text>
                            <Text>{change.web_name_player_in}</Text>
                            <Text>{change.points_gain}</Text>
                            <Text>{change.transfer_cost}</Text>
                        </div>
                    )
                    })}
                </div>
            </div>
        )
    }
}
