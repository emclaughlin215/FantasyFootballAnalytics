import './PlayerDetails.scss';

import { Divider, Tab, TabId, Tabs, Tag } from '@blueprintjs/core';
import React from 'react';
import { IGameweekInfo, IPlayer, IPlayerFixture, IStringElementMap } from '../index.d';
import { loaded, loading, LoadState } from '../utils/LoadState';
import { capitaliseSentence } from '../utils/String';


interface PlayerDetailsProps {
    player_id: string;
    gameweek: LoadState<IGameweekInfo>;
}

interface PlayerDetailsState {
    player: LoadState<IPlayer[]>
    playerFixtures: LoadState<IPlayerFixture[]>
    tabId: TabId
}

class   PlayerDetails extends React.PureComponent<PlayerDetailsProps, PlayerDetailsState> {
    constructor(props: PlayerDetailsProps) {
        super(props)
        this.state = {
            player: loading(),
            playerFixtures: loading(),
            tabId: 'gameweek',
        }
    }

    async componentDidMount() {
        const player: Response = await fetch('http://localhost:8000/players/all/' + this.props.player_id);
        const playerJson: IPlayer[] = await player.json();

        this.setState({
            player: loaded(playerJson),
        })
    }

    async componentDidUpdate(prevProps: PlayerDetailsProps) {

        if (prevProps.player_id !== this.props.player_id) {
            const player: Response = await fetch('http://localhost:8000/players/all/' + this.props.player_id);
            const playerJson: IPlayer[] = await player.json();
    
            this.setState({
                player: loaded(playerJson)
            })
        }
    }

    async setPlayersFixtures() {

        const gameweek: string = this.props.gameweek.type === 'loaded' ? this.props.gameweek.value.current.id.toString() : '';

        const player_team: number = this.state.player.type === 'loaded' ?  this.state.player.value[0]['team']: -1;
        const playerFixturesResponse: Response = await fetch('http://localhost:8000/fixtures/' + player_team.toString() + '/' + gameweek);
        const playerFixtureJson: IPlayerFixture[] = await playerFixturesResponse.json();
        this.setState({playerFixtures: loaded(playerFixtureJson)})
    }

    private playerListStaticElement(property: keyof IPlayer, name?: string) {
        return (
        <div className='player-details-list-element'>
            <p className={this.state.player.type === 'loading' ? 'bp3-skeleton' : 'player-details-list-name'}>{name ? name : capitaliseSentence(property, '_')}</p>
            <Divider />
            <p className={this.state.player.type === 'loading' ? 'bp3-skeleton' : ''}>{this.state.player.type === 'loaded' ? this.state.player.value[0][property] : ''}</p>    
        </div>
        )
    }

    private playerListElement(property: keyof IPlayer, name?: string) {
        return (
            <div className='player-details-list-element'>
                <p className={this.state.player.type === 'loading' ? 'bp3-skeleton' : 'player-details-list-name'}>{name ? name : capitaliseSentence(property, '_')}</p>
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

    private formatFixture = (fixture: IPlayerFixture) => {
        return fixture.opponent_name + ' (' + fixture.fixture_type.charAt(0).toUpperCase() + ')';
    }

    private getFormattedFixtures = (fixture: IPlayerFixture) => {
        return (
            <Tag
                className={'fixtures-opponent-' + fixture.fixture_type}
                round={true}
                intent={
                    fixture.opponent_difficulty === 5 ? 'danger' :
                    fixture.opponent_difficulty === 4 ? 'warning' :
                    fixture.opponent_difficulty === 3 ? 'primary' :
                    'success'
                }
            >
                {this.formatFixture(fixture)}
            </Tag>
        )
    }

    private playerFixtures() {
        return (
            <div>
                <text className='details-header'>Fixtures</text>
                <div className={this.state.player.type === 'loading' ? 'bp3-skeleton' : 'details-container player-fixtures-container'}>
                    {this.state.playerFixtures.type === 'loaded' ? this.state.playerFixtures.value.map((fixture, idx) => {
                        return (
                            <div key={idx} className={this.state.player.type === 'loading' ? 'bp3-skeleton' : 'player-fixture-' + fixture.fixture_type}>
                                {fixture.fixture_type === 'home' && this.getFormattedFixtures(fixture)}
                                <p className='fixtures-gameweek'>{'Gameweek ' + fixture.event}</p>
                                {fixture.fixture_type === 'away' && this.getFormattedFixtures(fixture)}
                            </div>
                            )
                    }) : <div></div>}
                </div>
            </div>
        )
    }

    private handleNavbarTabChange = (tabId: TabId) => this.setState({ tabId });

    render() {

        const tabIdToComponentMap: IStringElementMap = {
            "gameweek": this.playerList(),
            "season": this.playerList(),
        };

        // this.setPlayersFixtures();
        const playerFixtures = this.playerFixtures();

        return (
            <div className='player-details-layout'>
                <div className='player-details-vertical-container'>
                    <text className='details-header'>Statistics</text>
                    <div className='details-container datails-main-container'>
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
                            <Tab id="gameweek" title="Gameweek" />
                            <Tab id="season" title="Season" />
                            <Tabs.Expander />
                        </Tabs>
                        <div className='tab-container'>
                            {tabIdToComponentMap[this.state.tabId.toString()]}
                        </div>
                    </div>
                </div>
                {playerFixtures}
            </div>
        )
    }

}


export default PlayerDetails
