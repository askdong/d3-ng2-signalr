import { Component, Input, OnInit } from '@angular/core';
import { SignalR } from 'ng2-signalr';

export interface WaferLayout
{
  name: string;
  label: string;
  width: number;
  height: number;
  dieWidth: number;
  dieHeight: number;
}


@Component({
  selector: 'app-wrapper-wafer-map',
  templateUrl: './wrapper-wafer-map.component.html',
  styleUrls: ['./wrapper-wafer-map.component.css']
})
export class WrapperWaferMapComponent implements OnInit
{

  @Input() selectedLayout: WaferLayout;

  public WaferLayouts: WaferLayout[] = [
    // {
    //   name: 'small',
    //   label: 'Small Visualization',
    //   width: 400,
    //   height: 400,
    //   dieWidth: 4,
    //   dieHeight: 2
    // },
    {
      name: 'large',
      label: 'Large Visualization',
      width: 700,
      height: 700,
      dieWidth: 7,
      dieHeight: 4
    }
  ];

  

  ngOnInit()
  {
    if (this.selectedLayout === undefined)
    {
      this.selectedLayout = this.WaferLayouts[0];
    }
  }

  public onActiveButtonChange(layout: WaferLayout): void
  {
    this.selectedLayout = layout;
  }


}

