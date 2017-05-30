
import * as Stats       from '../lib/stats.mod.js';
import {ThreeStats}     from '../core/main.ext';

export default class StatsGraph
{
  private stats:ThreeStats;

  constructor(mode:number = 1, appendElement?:HTMLElement, clickHandler?:any)
  {
    this.stats = Stats(clickHandler);
    let e = appendElement || document.body;
    e.appendChild( this.stats.dom );
    this.stats.showPanel( mode );
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = '';
    this.stats.dom.style.bottom = "0";
    // this.stats.dom.style.right = "5px";
    this.stats.dom.style.left = "30px";
  }

  begin():void
  {
    this.stats.begin();
  }

  setview(title:number)
  {
    this.stats.setview(title);
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
