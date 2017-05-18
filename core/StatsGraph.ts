
import * as Stats       from '../lib/stats.min.js';
import {ThreeStats}     from './main.ext';

export default class StatsGraph
{
  private stats:ThreeStats;

  constructor()
  {
    this.stats = Stats();
    document.body.appendChild( this.stats.dom );
    this.stats.showPanel( 1 );
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "5px";
    this.stats.dom.style.right = "5px";
    this.stats.dom.style.left = "";
  }

  begin():void
  {
    this.stats.begin();
  }

  end():void
  {
    this.stats.end();
  }

}
