import './News.scss';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';
import { NonIdealState } from '@blueprintjs/core';


interface INewsProps {
  playerState: IPlayerReducer,
}

export class News extends React.PureComponent<INewsProps> {
  constructor(props: INewsProps) {
    super(props);
  }

  private NewsItem(first_name: string, second_name: string, news: string, news_added: string) {
    const date_added = moment(news_added.trim(), "YYYY-MM-DDTHH:mm:ss.ssssss").format("Do MMM YYYY");
    return (
      <div>
        <h3> {first_name + " " + second_name + ' (' + date_added + ')'} </h3>
        {news} 
      </div>
    )
  }

  render() {
    const { filteredPlayerLatest } = this.props.playerState;
    return (
      <div className='news-list-container'>
        {filteredPlayerLatest.type === 'loaded' ?
          filteredPlayerLatest.value
          .sort((a, b) => {
            const a_news_added = moment(a.news_added.trim(), "YYYY-MM-DDTHH:mm:ss.ssssss")
            const b_news_added = moment(b.news_added.trim(), "YYYY-MM-DDTHH:mm:ss.ssssss");
            return a_news_added.unix() - b_news_added.unix();
          })
          .map(player => {
            return player.news && player.news_added ?
              <div className='news-list-element'>
                {this.NewsItem(player.first_name, player.second_name, player.news, player.news_added)}
              </div> :
              undefined
          }) :
          <NonIdealState
          className="graph-non-ideal-state"
          title="No Filters Defined"
          description="Please filter the players to view Graphs"
      />
        }
      </div> 
    )
  }
}

const mapStateToProps = (state: ICombinedReducers) => {
  return {
    playerState: state.PlayerReducer,
  }
}

export default connect(mapStateToProps)(News);