
import * as Stats       from '../lib/stats.min.js';
import {ThreeStats}     from './main.ext';

export default class StatsGraph
{
  private stats:ThreeStats;

  constructor(mode:number = 1)
  {
    this.stats = Stats();
    document.body.appendChild( this.stats.dom );
    this.stats.showPanel( mode );
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "5px";
    // this.stats.dom.style.right = "5px";
    this.stats.dom.style.left = "5px";
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

export enum StatsMode
{
  FPS = 0,
  MS = 1,
  MB = 2,
  CUSTOM = 3
}
