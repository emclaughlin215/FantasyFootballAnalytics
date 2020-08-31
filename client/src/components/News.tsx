import './News.scss';

import React from 'react';
import { connect } from 'react-redux';

import { IGlobalReducer } from '../reducers/GlobalReducers';
import { ICombinedReducers } from '../reducers/Reducers';

interface INewsProps {
  state: IGlobalReducer
}

export class News extends React.PureComponent<INewsProps> {
  constructor(props: INewsProps) {
    super(props);
  }

  render() {
    const { playerList } = this.props.state;
    return (
      <div className="news-container">
        {playerList.type === 'loaded' ?
          playerList.value.map(player => {
            return player.news && player.news_added ?
              <div className='news-element'>
                {player.first_name + " " + player.second_name + ": " + player.news + " " + player.news_added.toString()}
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
    state: state.GlobalReducer,
  }
}

export default connect(mapStateToProps)(News);