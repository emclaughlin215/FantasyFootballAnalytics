(this["webpackJsonpfsntasy-premier-league-analytics"]=this["webpackJsonpfsntasy-premier-league-analytics"]||[]).push([[0],{162:function(e,t,a){e.exports=a(198)},163:function(e,t,a){},172:function(e,t,a){},174:function(e,t,a){},197:function(e,t,a){},198:function(e,t,a){"use strict";a.r(t);a(163);var n=a(0),r=a.n(n),l=a(11),i=a.n(l),s=a(33),c=a(27),o=a(113),u=a(23),d=a(24),m=a(30),y=a(29),p=(a(172),a(2)),f=a(38),v=a.n(f),h=a(68),b="LOAD PLAYERS",P="LOAD TEAMS",g="LOAD PLAYER TYPES",E=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:b,payload:r});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var L=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:g,payload:r});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};var O=function(e){return function(){var t=Object(h.a)(v.a.mark((function t(a){var n,r;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:r=t.sent,a({type:P,payload:r});case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()};a(174);var k=a(203),j=a(5),C=a(9),T=a(202);function w(e){return{type:"loaded",value:e}}var x=function(e){return e.singular_name},I=function(e){return e.first_name+" "+e.second_name},_=function(e){return e.name},S=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var i="".concat(e.plural_name);return r.a.createElement(p.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:M(i,l)})},N=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var i="".concat(e.first_name," ").concat(e.second_name);return r.a.createElement(p.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:M(i,l)})},R=function(e,t){var a=t.handleClick,n=t.modifiers,l=t.query;if(!n.matchesPredicate)return null;var i="".concat(e.name);return r.a.createElement(p.MenuItem,{active:n.active,disabled:n.disabled,key:e.id,onClick:a,text:M(i,l)})};function A(e){return e.replace(/([.*+?^=!:${}()|[\]/\\])/g,"\\$1")}function M(e,t){var a=0,n=t.split(/\s+/).filter((function(e){return e.length>0})).map(A);if(0===n.length)return[e];for(var l=new RegExp(n.join("|"),"gi"),i=[];;){var s=l.exec(e);if(!s)break;var c=s[0].length,o=e.slice(a,l.lastIndex-c);o.length>0&&i.push(o),a=l.lastIndex,i.push(r.a.createElement("strong",{key:a},s[0]))}var u=e.slice(a);return u.length>0&&i.push(u),i}var B=function(e,t,a,n){var r=t.plural_name.toLowerCase()+" "+t.plural_name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},D=function(e,t,a,n){var r=t.first_name.toLowerCase()+" "+t.second_name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},G=function(e,t,a,n){var r=t.name.toLowerCase(),l=e.toLowerCase();return n?r===l:"".concat(r).indexOf(l)>=0},H=a(50),V=a(49),q=a(117),z=function(){function e(t,a){Object(u.a)(this,e),this.name=t,this.stat=a}return Object(d.a)(e,[{key:"getColumn",value:function(e,t){var a=this;return r.a.createElement(q.a,{cellRenderer:function(t){return r.a.createElement(H.a,null,e(t,a.stat))},columnHeaderCellRenderer:function(){return r.a.createElement(V.a,{name:a.name,menuRenderer:function(){return a.renderMenu(t)}})},name:this.name})}}]),e}(),F=function(e){Object(m.a)(a,e);var t=Object(y.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"renderMenu",value:function(e){var t=this;return r.a.createElement(p.Menu,null,r.a.createElement(p.MenuItem,{icon:"sort-asc",onClick:function(){return e((function(e,a){return t.compare(e,a)}))},text:"Sort Asc"}),r.a.createElement(p.MenuItem,{icon:"sort-desc",onClick:function(){return e((function(e,a){return t.compare(a,e)}))},text:"Sort Desc"}))}},{key:"compare",value:function(e,t){return e.toString().localeCompare(t)}}]),a}(z),W=function(e){Object(m.a)(a,e);var t=Object(y.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"renderMenu",value:function(e){var t=this;return r.a.createElement(p.Menu,null,r.a.createElement(p.MenuItem,{icon:"sort-asc",onClick:function(){return e((function(e,a){return t.compare(e,a)}))},text:"Sort Asc"}),r.a.createElement(p.MenuItem,{icon:"sort-desc",onClick:function(){return e((function(e,a){return t.compare(a,e)}))},text:"Sort Desc"}))}},{key:"compare",value:function(e,t){return t-e}}]),a}(z);var Y=function(e){Object(m.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).getLoadingOptions=function(){return"loading"===n.props.state.playerList.type?[j.e.CELLS]:[]},n.sortColumn=function(e){var t=n.state.filteredPlayerList;if("loaded"===t.type){var a=C.b.times(t.value.length,(function(e){return e}));a.sort((function(a,n){return e(t.value[a],t.value[n])})),n.setState({sortedPlayerIndex:a})}},n.getCellData=function(e,t){var a=n.state,r=a.filteredPlayerList,l=a.sortedPlayerIndex;if("loaded"===r.type){var i=l[e];return null!=i&&(e=i),t.map((function(t){return r.value[e][t]})).reduce((function(e,t){return[e,t].join(" ")}))}},n.state={filteredPlayerList:{type:"loading"},sortedPlayerIndex:[],columns:[new F("Player",["first_name","second_name"]),new W("Price",["now_cost"]),new W("Goals Scored",["goals_scored"]),new W("Assists",["assists"]),new W("Clean Sheets",["clean_sheets"]),new W("Bonus Points",["bonus"]),new W("Form / Cost",["form_to_cost"]),new W("Bonus / Cost",["bonus_to_cost"])]},n}return Object(d.a)(a,[{key:"filterPlayersByTeam",value:function(e){this.filterPlayers(e,this.state.selectedPlayerType),this.setState({selectedTeam:e})}},{key:"filterPlayersByType",value:function(e){this.filterPlayers(this.state.selectedTeam,e),this.setState({selectedPlayerType:e})}},{key:"filterPlayers",value:function(e,t){this.setState({filteredPlayerList:{type:"loading"}});var a=this.props.state.playerList,n="loaded"===a.type?a.value:[];n=void 0!==t?n.filter((function(e){return e.element_type===t.id})):n,n=void 0!==e?n.filter((function(t){return t.team===e.id})):n,this.setState({filteredPlayerList:w(n)})}},{key:"render",value:function(){var e=this,t=this.props.state,a=t.playerList,n=t.playerTypeList,l=t.teamList,i=this.state.columns,s=k.a.ofType(),c=k.a.ofType(),o="loading"===a.type?[]:i.map((function(t){return t.getColumn(e.getCellData,e.sortColumn)}));return r.a.createElement("div",{className:"body-container"},r.a.createElement("div",{className:"tab-title"},r.a.createElement(p.Icon,{icon:"predictive-analysis",iconSize:20}),r.a.createElement(p.H3,{className:"bp3-heading"},"Performance Analysis")),r.a.createElement("div",null,r.a.createElement("div",{className:"dropdown-container"},r.a.createElement(s,{className:"loading"===n.type?"bp3-skeleton":"dropdown",itemPredicate:B,inputValueRenderer:x,onItemSelect:function(t){e.filterPlayersByType(t)},items:"loaded"===n.type?n.value:[],itemRenderer:S,noResults:r.a.createElement(p.MenuItem,{disabled:!0,text:"No results."})}),r.a.createElement(c,{className:"loading"===l.type?"bp3-skeleton":"dropdown",itemPredicate:G,inputValueRenderer:_,onItemSelect:function(t){e.filterPlayersByTeam(t)},items:"loaded"===l.type?l.value:[],itemRenderer:R,noResults:r.a.createElement(p.MenuItem,{disabled:!0,text:"No results."})})),r.a.createElement("div",null,r.a.createElement(T.a,{numRows:"loading"===this.state.filteredPlayerList.type?0:this.state.filteredPlayerList.value.length>20?20:this.state.filteredPlayerList.value.length,enableColumnReordering:!0,numFrozenColumns:1,loadingOptions:this.getLoadingOptions()},o))))}}]),a}(r.a.PureComponent),$=Object(s.b)((function(e){return{state:e}}))(Y),J=(a(197),function(e){Object(m.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).state={filteredPlayerList:{type:"loading"}},n}return Object(d.a)(a,[{key:"filterPlayers",value:function(e){this.setState({filteredPlayerList:{type:"loading"}});var t="loaded"===this.props.state.playerList.type?this.props.state.playerList.value:[];t=t.filter((function(t){return t.team===e.id})),this.setState({filteredPlayerList:w(t)})}},{key:"handleSelectPlayer",value:function(e){this.setState({selectedPlayer:e})}},{key:"render",value:function(){var e,t,a,n,l,i,s,c,o,u,d=this,m=this.props.state,y=m.teamList,f=m.playerList,v=k.a.ofType(),h=k.a.ofType(),b=[["Goals Scored (Assists)",null===(e=this.state.selectedPlayer)||void 0===e?void 0:e.goals_scored,null===(t=this.state.selectedPlayer)||void 0===t?void 0:t.assists],["Creativity (Rank)",null===(a=this.state.selectedPlayer)||void 0===a?void 0:a.creativity,null===(n=this.state.selectedPlayer)||void 0===n?void 0:n.creativity_rank],["Influence (Rank)",null===(l=this.state.selectedPlayer)||void 0===l?void 0:l.influence,null===(i=this.state.selectedPlayer)||void 0===i?void 0:i.influence_rank],["Threat (Rank)",null===(s=this.state.selectedPlayer)||void 0===s?void 0:s.threat,null===(c=this.state.selectedPlayer)||void 0===c?void 0:c.threat_rank],["Chance of Playing (next)",null===(o=this.state.selectedPlayer)||void 0===o?void 0:o.chance_of_playing_this_round,null===(u=this.state.selectedPlayer)||void 0===u?void 0:u.chance_of_playing_next_round]];return r.a.createElement("div",{className:"body-container"},r.a.createElement("div",{className:"tab-title"},r.a.createElement(p.Icon,{icon:"person",iconSize:20}),r.a.createElement(p.H3,{className:"bp3-heading"},"Player Analysis")),r.a.createElement("div",null,r.a.createElement("div",{className:"dropdown-container"},r.a.createElement(h,{className:"loading"===y.type?"bp3-skeleton":"dropdown",itemPredicate:G,inputValueRenderer:_,onItemSelect:function(e){d.filterPlayers(e)},items:"loaded"===y.type?y.value:[],itemRenderer:R,noResults:r.a.createElement(p.MenuItem,{disabled:!0,text:"No results."})}),r.a.createElement(v,{className:"loading"===f.type?"bp3-skeleton":"dropdown",itemPredicate:D,inputValueRenderer:I,onItemSelect:function(e){d.handleSelectPlayer(e)},items:"loaded"===this.state.filteredPlayerList.type?this.state.filteredPlayerList.value:[],itemRenderer:N,noResults:r.a.createElement(p.MenuItem,{disabled:!0,text:"No results."})})),r.a.createElement("div",{className:"stats-container"},b.map((function(e){return void 0!==d.state.selectedPlayer&&(null!==e[1]||null!==e[2])&&r.a.createElement(p.Card,{className:"stats-card",interactive:!1,elevation:p.Elevation.THREE},r.a.createElement("h3",null,e[0]),r.a.createElement("p",null,e[1]+" ("+e[2]+")"))})))))}}]),a}(r.a.PureComponent)),K=Object(s.b)((function(e){return{state:e}}))(J),Q=function(e){Object(m.a)(a,e);var t=Object(y.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).tabIdToComponentMap={playerAnalysis:r.a.createElement(K,null),PerformanceAnalysis:r.a.createElement($,null)},n.handleNavbarTabChange=function(e){return n.setState({navbarTabId:e})},n.displayActiveTab=function(e){return n.tabIdToComponentMap[e]},n.state={activePanelOnly:!0,animate:!0,navbarTabId:"playerAnalysis",vertical:!1},n}return Object(d.a)(a,[{key:"componentWillMount",value:function(){var e=this.props,t=e.getPlayerList,a=e.getPlayerTypeList,n=e.getTeamList;t("http://localhost:8000/players/all"),a("http://localhost:8000/players/types"),n("http://localhost:8000/teams/all")}},{key:"render",value:function(){return r.a.createElement("div",{className:"bp3-dark"},r.a.createElement(p.Navbar,null,r.a.createElement(p.Navbar.Group,null,r.a.createElement(p.Navbar.Heading,{className:"app-header"},"Fantasy Premier League Analytics")),r.a.createElement(p.Navbar.Group,{align:p.Alignment.RIGHT},r.a.createElement(p.Tabs,{animate:this.state.animate,renderActiveTabPanelOnly:this.state.activePanelOnly,id:"MainTabs",large:!0,onChange:this.handleNavbarTabChange,selectedTabId:this.state.navbarTabId,vertical:!1},r.a.createElement(p.Tab,{id:"playerAnalysis",title:"Player Analysis"}),r.a.createElement(p.Tab,{id:"PerformanceAnalysis",title:"Performance Analysis"}),r.a.createElement(p.Tabs.Expander,null)))),r.a.createElement("div",{className:"main-container"},this.displayActiveTab(this.state.navbarTabId.toString())))}}]),a}(r.a.PureComponent),U=Object(s.b)((function(e){return{state:e}}),(function(e){return Object(c.b)({getPlayerList:E,getPlayerTypeList:L,getTeamList:O},e)}))(Q),X=a(39),Z={playerList:{type:"loading"},playerTypeList:{type:"loading"},teamList:{type:"loading"}},ee=Object(c.c)({GlobalReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Z,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case b:return Object(X.a)(Object(X.a)({},e),{},{playerList:w(t.payload)});case g:return Object(X.a)(Object(X.a)({},e),{},{playerTypeList:w(t.payload)});case P:return Object(X.a)(Object(X.a)({},e),{},{teamList:w(t.payload)});default:return e}}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var te=Object(c.d)(ee,Object(c.a)(o.a));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(s.a,{store:te},r.a.createElement(U,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[162,1,2]]]);
//# sourceMappingURL=main.abfac467.chunk.js.map