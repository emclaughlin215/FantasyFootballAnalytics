import './PlayerDetails.scss';

import { Divider, Tab, TabId, Tabs } from '@blueprintjs/core';
import React from 'react';
import { IPlayer, IStringElementMap } from '../index.d';
import { loaded, loading, LoadState } from '../utils/LoadState';
import { capitaliseSentence } from '../utils/String';


interface PlayerDetailsProps {
    player_id: LoadState<number>;
}

interface PlayerDetailsState {
    player: LoadState<IPlayer[]>
    tabId: TabId
}


class PlayerDetails extends React.PureComponent<PlayerDetailsProps, PlayerDetailsState> {
    constructor(props: PlayerDetailsProps) {
        super(props)
        this.state = {
            player: loading(),
            tabId: 'gameweek',
        }
    }

    async componentDidMount() {
        const playerIn: Response = await fetch("http://localhost:8000/players/all/" + this.props.player_id);
        const playerJson: IPlayer[] = await playerIn.json();
        this.setState({player: loaded(playerJson)})
    }

    private playerListStaticElement(property: keyof IPlayer, name?: string) {
        return (
        <div className='player-details-list-element'>
            <p className='player-details-list-name'>{name ? name : capitaliseSentence(property, '_')}</p>
            <Divider />
            <p className={this.state.player.type === 'loading' ? 'bp3-skeleton' : ''}>{this.state.player.type === 'loaded' ? this.state.player.value[0][property] : ''}</p>    
        </div>
        )
    }

    private playerListElement(property: keyof IPlayer, name?: string) {
        return (
        <div className='player-details-list-element'>
            <p className='player-details-list-name'>{name ? name : capitaliseSentence(property, '_')}</p>
            <Divider />
            <p className={this.state.player.type === 'loading' ? 'bp3-skeleton' : ''}>
                {this.state.player.type === 'loaded' ? 
                (
                    this.state.tabId === 'gameweek' ?
                    (this.state.player.value[0][property] as number) - (this.state.player.value[1][property] as number) :
                    this.state.player.value[0][property]
                ):
                ''}
            </p>    
        </div>
        )
    }

    private playerList() {
        return (
            <div className='player-details-list'>
                {
                    this.state.tabId === 'gameweek' ?
                    this.playerListStaticElement('cost_change_event', 'Cost Change (Gameweek)') :
                    this.playerListStaticElement('cost_change_start', 'Cost Change (Season)')
                }
                {this.playerListElement('goals_scored')}
                {this.playerListElement('assists')}
                {this.playerListElement('bonus')}
                {this.playerListElement('bps', 'Bonus Points System')}
                {this.playerListElement('yellow_cards')}
                {this.playerListElement('red_cards')}
                {this.playerListElement('clean_sheets')}
            </div>
        )
    }

    private handleNavbarTabChange = (tabId: TabId) => this.setState({ tabId });

    render() {
        const tabIdToComponentMap: IStringElementMap = {
            "gameweek": this.playerList(),
            "season": this.playerList(),
          }
        return (
        <div className='player-details-tab-container'>
            {this.playerListStaticElement('event_points', 'Points')}
            {this.playerListStaticElement('ep_this', 'Expected Points (this gameweek)')}
            {this.playerListStaticElement('ep_next', 'Expected Points (next gameweek)')}
            {this.playerListStaticElement('cost')}
            <Tabs
                animate={true}
                renderActiveTabPanelOnly={true}
                id="MainTabs"
                large={true}
                onChange={this.handleNavbarTabChange}
                selectedTabId={this.state.tabId}
                vertical={false}>
                <Tabs.Expander />
                <Tab id="gameweek" title="Gameweek" />
                <Tab id="season" title="Season" />
            </Tabs>
            <div className='tabs-container'>
                {tabIdToComponentMap[this.state.tabId.toString()]}
            </div>
        </div>
        )
    }

}


export default PlayerDetails
