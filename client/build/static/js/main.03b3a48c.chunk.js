(this["webpackJsonpfsntasy-premier-league-analytics"]=this["webpackJsonpfsntasy-premier-league-analytics"]||[]).push([[0],{163:function(e,t,a){e.exports=a(201)},164:function(e,t,a){},173:function(e,t,a){},175:function(e,t,a){},198:function(e,t,a){},199:function(e,t,a){},201:function(e,t,a){"use strict";a.r(t);a(164);var n=a(0),r=a.n(n),l=a(11),s=a.n(l),i=a(26),c=a(28),o=a(113),u=a(20),d=a(21),p=a(24),y=a(23),m=(a(173),a(2)),f=a(34),v=a.n(f),h=a(51),b="LOAD PLAYERS",g="LOAD PLAYERS LATEST",L="LOAD TEAMS",E="LOAD PLAYER TYPES",P="FILTER PLAYERS",O=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:g,payload:{playersLatest:r}});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var T=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:b,payload:{players:r}});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var w=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:E,payload:r});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var S=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:L,payload:r});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var j=function(e,t){return{type:P,payload:{playersLatest:e,players:t}}},k=(a(175),a(206)),C=a(5),I=a(9),N=a(205);function x(e){return{type:"loaded",value:e}}var _=function(e){return e.singular_name},R=function(e){return e.first_name+" "+e.second_name},A=function(e){return e.name},M=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var s="".concat(e.plural_name);return r.a.createElement(m.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:B(s,l)})},Y=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var s="".concat(e.first_name," ").concat(e.second_name);return r.a.createElement(m.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:B(s,l)})},G=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var s="".concat(e.name);return r.a.createElement(m.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:B(s,l)})};function D(e){return e.replace(/([.*+?^=!:${}()|[\]/\\])/g,"\\$1")}function B(e,t){var a=0,n=t.split(/\s+/).filter((function(e){return e.length>0})).map(D);if(0===n.length)return[e];for(var l=new RegExp(n.join("|"),"gi"),s=[];;){var i=l.exec(e);if(!i)break;var c=i[0].length,o=e.slice(a,l.lastIndex-c);o.length>0&&s.push(o),a=l.lastIndex,s.push(r.a.createElement("strong",{key:a},i[0]))}var u=e.slice(a);return u.length>0&&s.push(u),s}var F=function(e,t,a,n){var r=t.plural_name.toLowerCase()+" "+t.plural_name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},H=function(e,t,a,n){var r=t.first_name.toLowerCase()+" "+t.second_name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},V=function(e,t,a,n){var r=t.name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},q=a(50),z=a(49),W=a(117);function $(e,t){return e[t]}function J(e){return"member"in e}var Z=function(){function e(t,a){Object(u.a)(this,e),this.name=t,this.stat=a}return Object(d.a)(e,[{key:"getColumn",value:function(e,t){var a=this;return r.a.createElement(W.a,{cellRenderer:function(t){return r.a.createElement(q.a,null,e(t,a.stat))},columnHeaderCellRenderer:function(){return r.a.createElement(z.a,{name:a.name,menuRenderer:function(){return a.renderMenu(t)}})},name:this.name})}}]),e}(),K=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"renderMenu",value:function(e){var t=this;return r.a.createElement(m.Menu,null,r.a.createElement(m.MenuItem,{icon:"sort-asc",onClick:function(){return e((function(e,a){return t.compare(e,a)}))},text:"Sort Asc"}),r.a.createElement(m.MenuItem,{icon:"sort-desc",onClick:function(){return e((function(e,a){return t.compare(a,e)}))},text:"Sort Desc"}))}},{key:"compare",value:function(e,t){return"string"!==typeof this.stat[0]?0:$(e,this.stat[0]).toString().localeCompare($(t,this.stat[0]).toString())}}]),a}(Z),Q=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"renderMenu",value:function(e){var t=this;return r.a.createElement(m.Menu,null,r.a.createElement(m.MenuItem,{icon:"sort-asc",onClick:function(){return e((function(e,a){return t.compare(e,a)}))},text:"Sort Asc"}),r.a.createElement(m.MenuItem,{icon:"sort-desc",onClick:function(){return e((function(e,a){return t.compare(a,e)}))},text:"Sort Desc"}))}},{key:"compare",value:function(e,t){return"number"!==typeof this.stat[0]||"bigint"!==typeof this.stat[0]?0:$(e,this.stat[0])-$(t,this.stat[0])}}]),a}(Z),U=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).getLoadingOptions=function(){return"loading"===n.props.playerState.playerListLatest.type?[C.e.CELLS]:[]},n.sortColumn=function(e){var t=n.state.filteredPlayerList;if("loaded"===t.type){var a=I.b.times(t.value.length,(function(e){return e}));a.sort((function(a,n){return e(t.value[a],t.value[n])})),n.setState({sortedPlayerIndex:a})}},n.getCellData=function(e,t){var a=n.state,r=a.filteredPlayerList,l=a.sortedPlayerIndex;if("loaded"===r.type){var s=l[e];return null!=s&&(e=s),t.map((function(t){return $(r.value[e],t)})).reduce((function(e,t){return[e,t].join(" ")}))}},n.state={filteredPlayerList:{type:"loading"},sortedPlayerIndex:[],columns:[new K("Player",["first_name","second_name"]),new Q("Price",["now_cost"]),new Q("Points",["total_points"]),new Q("Form",["form"]),new Q("Goals Scored",["goals_scored"]),new Q("Assists",["assists"]),new Q("Clean Sheets",["clean_sheets"]),new Q("Bonus Points",["bonus"]),new Q("Form / Cost",["form_to_cost"]),new Q("Bonus / Cost",["bonus_to_cost"])]},n}return Object(d.a)(a,[{key:"filterPlayersByTeam",value:function(e){this.filterPlayers(e,this.state.selectedPlayerType),this.setState({selectedTeam:e})}},{key:"filterPlayersByType",value:function(e){this.filterPlayers(this.state.selectedTeam,e),this.setState({selectedPlayerType:e})}},{key:"filterPlayers",value:function(e,t){this.setState({filteredPlayerList:{type:"loading"}});var a=this.props.playerState.playerListLatest,n="loaded"===a.type?a.value:[];n=void 0!==t?n.filter((function(e){return e.element_type===t.id})):n,n=void 0!==e?n.filter((function(t){return t.team===e.id})):n,this.setState({filteredPlayerList:x(n)})}},{key:"render",value:function(){var e=this,t=this.props.playerState.playerListLatest,a=this.props.globalState,n=a.teamList,l=a.playerTypeList,s=this.state.columns,i=k.a.ofType(),c=k.a.ofType(),o="loading"===t.type?[]:s.map((function(t){return t.getColumn(e.getCellData,e.sortColumn)}));return r.a.createElement("div",{className:"body-container"},r.a.createElement("div",{className:"tab-title"},r.a.createElement(m.Icon,{icon:"predictive-analysis",iconSize:20}),r.a.createElement(m.H3,{className:"bp3-heading"},"Performance Analysis")),r.a.createElement("div",null,r.a.createElement("div",{className:"dropdown-container"},r.a.createElement(i,{className:"loading"===l.type?"bp3-skeleton":"dropdown",itemPredicate:F,inputValueRenderer:_,onItemSelect:function(t){e.filterPlayersByType(t)},items:"loaded"===l.type?l.value:[],itemRenderer:M,noResults:r.a.createElement(m.MenuItem,{disabled:!0,text:"No results."})}),r.a.createElement(c,{className:"loading"===n.type?"bp3-skeleton":"dropdown",itemPredicate:V,inputValueRenderer:A,onItemSelect:function(t){e.filterPlayersByTeam(t)},items:"loaded"===n.type?n.value:[],itemRenderer:G,noResults:r.a.createElement(m.MenuItem,{disabled:!0,text:"No results."})})),r.a.createElement("div",null,r.a.createElement(N.a,{numRows:"loading"===this.state.filteredPlayerList.type?0:this.state.filteredPlayerList.value.length>20?20:this.state.filteredPlayerList.value.length,enableColumnReordering:!0,numFrozenColumns:1,loadingOptions:this.getLoadingOptions()},o))))}}]),a}(r.a.PureComponent),X=Object(i.b)((function(e){return{globalState:e.GlobalReducer,playerState:e.PlayerReducer}}))(U),ee=(a(198),a(199),a(118)),te=a.n(ee),ae=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(e){return Object(u.a)(this,a),t.call(this,e)}return Object(d.a)(a,[{key:"NewsItem",value:function(e,t,a,n){var l=te()(n.trim(),"YYYY-MM-DDTHH:mm:ss.ssssssZ").format("Do MMM YYYY");return r.a.createElement("div",null,r.a.createElement("h3",null," ",e+" "+t," "),r.a.createElement("h4",null," ",l+" "+n," "),a)}},{key:"render",value:function(){var e=this,t=this.props.playerState.filteredPlayerList;return r.a.createElement("div",{className:"news-container"},"loaded"===t.type?t.value.map((function(t){return t.news&&t.news_added?r.a.createElement("div",{className:"news-element"},e.NewsItem(t.first_name,t.second_name,t.news,t.news_added)):void 0})):"No News")}}]),a}(r.a.PureComponent),ne=Object(i.b)((function(e){return{playerState:e.PlayerReducer}}))(ae),re=(r.a.PureComponent,Object(i.b)((function(e){return{state:e.GlobalReducer}}))(se)),le=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).tabIdToComponentMap={playerNews:r.a.createElement(ne,null),playerGraphs:r.a.createElement(re,null)},n.handleNavbarTabChange=function(e){return n.setState({navbarTabId:e})},n.state={navbarTabId:"playerGraphs"},n}return Object(d.a)(a,[{key:"filterPlayers",value:function(e){var t="loaded"===this.props.playerState.playerListLatest.type?this.props.playerState.playerListLatest.value:[];t=t.filter((function(t){return t.team===e.id}));var a="loaded"===this.props.playerState.playerList.type?this.props.playerState.playerList.value:[];a=a.filter((function(t){return t.team===e.id})),this.props.setFilteredPlayerList(t,a)}},{key:"handleSelectPlayer",value:function(e){var t="loaded"===this.props.playerState.filteredPlayerList.type?this.props.playerState.filteredPlayerList.value:[];t.filter((function(t){return t.code===e.code}));var a="loaded"===this.props.playerState.filteredPlayerList.type?this.props.playerState.filteredPlayerList.value:[];a.filter((function(t){return t.code===e.code})),this.props.setFilteredPlayerList(t,a)}},{key:"render",value:function(){var e=this,t=this.props.globalState.teamList,a=this.props.playerState.playerListLatest,n=this.state.selectedPlayer,l=k.a.ofType(),s=k.a.ofType();return r.a.createElement("div",{className:"body-container"},r.a.createElement("div",{className:"tab-title"},r.a.createElement(m.Icon,{icon:"person",iconSize:20}),r.a.createElement(m.H3,{className:"bp3-heading"},"Player Analysis")),r.a.createElement("div",null,r.a.createElement("div",{className:"dropdown-container"},r.a.createElement(s,{className:"loading"===t.type?"bp3-skeleton":"dropdown",itemPredicate:V,inputValueRenderer:A,onItemSelect:function(t){e.filterPlayers(t)},items:"loaded"===t.type?t.value:[],itemRenderer:G,noResults:r.a.createElement(m.MenuItem,{disabled:!0,text:"No results."})}),r.a.createElement(l,{className:"loading"===a.type?"bp3-skeleton":"dropdown",itemPredicate:H,inputValueRenderer:R,onItemSelect:function(t){e.handleSelectPlayer(t)},items:"loaded"===this.props.playerState.filteredPlayerList.type?this.props.playerState.filteredPlayerList.value:[],itemRenderer:Y,noResults:r.a.createElement(m.MenuItem,{disabled:!0,text:"No results."})}),r.a.createElement("div",{className:"stats-container"},n&&[["Goals Scored (Assists)","goals_scored","assists"],["Creativity (Rank)","creativity","creativity_rank"],["Influence (Rank)","influence","influence_rank"],["Threat (Rank)","threat","threat_rank"],["Chance of Playing (next)","chance_of_playing_this_round","chance_of_playing_next_round"]].map((function(e){return J(n)&&J(e[1])&&J(e[2])&&(null!==n[e[1]]||null!==n[e[2]])&&r.a.createElement(m.Card,{className:"stats-card",interactive:!1,elevation:m.Elevation.THREE},r.a.createElement("h3",null,e[0]),r.a.createElement("p",null,n[e[1]]+" ("+n[e[2]]+")"))})))),r.a.createElement("div",{className:"player-analysis-tabs"},r.a.createElement(m.Tabs,{animate:!0,renderActiveTabPanelOnly:!0,id:"MainTabs",large:!0,onChange:this.handleNavbarTabChange,selectedTabId:this.state.navbarTabId,vertical:!0},r.a.createElement(m.Tab,{id:"playerNews",title:"News"}),r.a.createElement(m.Tab,{id:"playerGraphs",title:"Analysis"}),r.a.createElement(m.Tabs.Expander,null)),r.a.createElement("div",null,this.tabIdToComponentMap[this.state.navbarTabId.toString()]))))}}]),a}(r.a.PureComponent),se=Object(i.b)((function(e){return{globalState:e.GlobalReducer,playerState:e.PlayerState}}),(function(e){return Object(c.b)({setFilteredPlayerList:j},e)}))(le),ie=function(e){Object(p.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).tabIdToComponentMap={playerAnalysis:r.a.createElement(se,null),PerformanceAnalysis:r.a.createElement(X,null)},n.handleNavbarTabChange=function(e){return n.setState({navbarTabId:e})},n.displayActiveTab=function(e){return n.tabIdToComponentMap[e]},n.state={activePanelOnly:!0,animate:!0,navbarTabId:"playerAnalysis",vertical:!1},n}return Object(d.a)(a,[{key:"componentWillMount",value:function(){var e=this.props,t=e.getPlayerLatestList,a=e.getPlayerList,n=e.getPlayerTypeList,r=e.getTeamList;t("http://localhost:8000/players/latest/all"),a("http://localhost:8000/players/all"),n("http://localhost:8000/players/types"),r("http://localhost:8000/teams/all")}},{key:"render",value:function(){return r.a.createElement("div",{className:"bp3-dark"},r.a.createElement(m.Navbar,null,r.a.createElement(m.Navbar.Group,null,r.a.createElement(m.Navbar.Heading,{className:"app-header"},"Fantasy Premier League Analytics")),r.a.createElement(m.Navbar.Group,{align:m.Alignment.RIGHT},r.a.createElement(m.Tabs,{animate:this.state.animate,renderActiveTabPanelOnly:this.state.activePanelOnly,id:"MainTabs",large:!0,onChange:this.handleNavbarTabChange,selectedTabId:this.state.navbarTabId,vertical:!1},r.a.createElement(m.Tab,{id:"playerAnalysis",title:"Player Analysis"}),r.a.createElement(m.Tab,{id:"PerformanceAnalysis",title:"Performance Analysis"}),r.a.createElement(m.Tabs.Expander,null)))),r.a.createElement("div",{className:"main-container"},this.displayActiveTab(this.state.navbarTabId.toString())))}}]),a}(r.a.PureComponent),ce=Object(i.b)((function(e){return{state:e}}),(function(e){return Object(c.b)({getPlayerLatestList:O,getPlayerTypeList:w,getPlayerList:T,getTeamList:S},e)}))(ie),oe=a(27),ue={playerTypeList:{type:"loading"},teamList:{type:"loading"}},de={playerListLatest:{type:"loading"},playerList:{type:"loading"},filteredPlayerList:{type:"loading"}},pe=Object(c.c)({GlobalReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ue,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case E:return Object(oe.a)(Object(oe.a)({},e),{},{playerTypeList:x(t.payload)});case L:return Object(oe.a)(Object(oe.a)({},e),{},{teamList:x(t.payload)});default:return e}},PlayerReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:de,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case g:return Object(oe.a)(Object(oe.a)({},e),{},{playerListLatest:x(t.payload.playersLatest)});case b:return Object(oe.a)(Object(oe.a)({},e),{},{playerList:x(t.payload.players)});case P:return Object(oe.a)(Object(oe.a)({},e),{},{filteredPlayerList:x(t.payload.playersLatest),filteredPlayer:x(t.payload.players)});default:return e}}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var ye=Object(c.d)(pe,Object(c.a)(o.a));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(i.a,{store:ye},r.a.createElement(ce,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[163,1,2]]]);
//# sourceMappingURL=main.03b3a48c.chunk.js.map