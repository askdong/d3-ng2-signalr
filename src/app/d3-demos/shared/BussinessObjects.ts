

export class DieRect {
  xCoord: number;
  yCoord: number;
  xWidth: number;
  yHeight: number;
  bin: number;
  site: number;

  fillColor : string;

  constructor(xCoord: number, yCoord:number, bin:number, site:number) 
  { 
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.bin = bin;
    this.site = site;
  }
}


export class Die
{
  X: number;
  Y: number;
  Color: string;
}
