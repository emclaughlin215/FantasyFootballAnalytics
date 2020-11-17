import './News.scss';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import { IPlayerReducer } from '../reducers/PlayerReducers';
import { ICombinedReducers } from '../reducers/Reducers';


interface INewsProps {
  playerState: IPlayerReducer,
}

export class News extends React.PureComponent<INewsProps> {
  constructor(props: INewsProps) {
    super(props);
  }

  private NewsItem(first_name: string, second_name: string, news: string, news_added: string) {
    const date_added = moment(news_added.trim(), "YYYY-MM-DDTHH:mm:ss.ssssssZ").format("Do MMM YYYY");
    return (
      <div>
        <h3> {first_name + " " + second_name} </h3>
        <h4> {date_added + " " + news_added} </h4>
        {news} 
      </div>
    )
  }

  render() {
    const { filteredPlayerLatest } = this.props.playerState;
    return (
      <div className="list-container">
        {filteredPlayerLatest.type === 'loaded' ?
          filteredPlayerLatest.value.map(player => {
            return player.news && player.news_added ?
              <div className='list-element'>
                {this.NewsItem(player.first_name, player.second_name, player.news, player.news_added)}
              </div> :
              undefined
          })
          : "No News"
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