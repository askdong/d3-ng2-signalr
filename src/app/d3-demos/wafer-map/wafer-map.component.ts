
/**
 * This component is an adaptation of the "Drag & Zoom II" Example provided by
 * Mike Bostock at https://bl.ocks.org/mbostock/3127661b6f13f9316be745e77fdfb084
 *
 * The implementation has been modified to illustrate the use of inputs to control
 * the layout of the D3 visualization.
 */

import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { SignalR, SignalRConnection, BroadcastEventListener } from 'ng2-signalr';
import { Subscription } from 'rxjs/Subscription';

import { D3Service, D3, D3DragEvent, D3ZoomEvent, Selection, Transition } from 'd3-ng2-service';
import { DieRect, Die } from '../shared';


@Component({
  selector: 'app-wafer-map',
  template: '<svg></svg>'
})
export class WaferMapComponent implements OnInit, OnChanges, OnDestroy
{

  @Input() width: number = 600;
  @Input() height: number = 600;
  @Input() dieWidth: number = 5;
  @Input() dieHeight: number = 5;

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private d3G: Selection<SVGGElement, any, null, undefined>;
  //private points: PhyllotaxisPoint[];
  private _arrDies: Array<DieRect>;

  private _connection: SignalRConnection;

  constructor(element: ElementRef, d3Service: D3Service, private _signalR: SignalR)
  {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;

    this._signalR.connect().then((c) =>
    {
      console.log("wafer signalr connected!");

      // 1.create a listener object
      let onMessageSent$ = new BroadcastEventListener<Die>('updateDie');

      // 2.register the listener
      c.listen(onMessageSent$);

      // 3.subscribe for incoming messages
      onMessageSent$.subscribe((die: Die) =>
      {
        // //console.log(die);
        // var dierect = this._arrDies.find(item => item.xCoord == die.X && item.yCoord == die.Y );
        // dierect.fillColor = "green";
        
        var d = new DieRect(die.X, die.Y, 0, 1);
        d.fillColor = "green";
        d.xWidth = this.dieWidth;
        d.yHeight = this.dieHeight;

        this._arrDies = new Array(d);        
        this.drawDies();
      });
    });

   
    
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) 
  {
    if (
       (changes['width'] && !changes['width'].isFirstChange()) ||
      (changes['height'] && !changes['height'].isFirstChange()) ||
      (changes['dieWidth'] && !changes['dieWidth'].isFirstChange()) ||
      (changes['dieHeight'] && !changes['dieHeight'].isFirstChange())
    ) 
    {
      if (this.d3Svg.empty && !this.d3Svg.empty()) 
      {
        this.changeLayout();
      }
    }

  }

  ngOnDestroy()
  {
    if (this.d3Svg.empty && !this.d3Svg.empty())
    {
      this.d3Svg.selectAll('*').remove();
    }
  }

  ngOnInit()
  {
    let d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;


    function zoomed(this: SVGSVGElement)
    {
      let e: D3ZoomEvent<SVGSVGElement, any> = d3.event;
      d3G.attr('transform', e.transform.toString());
    }

    // function dragged(this: SVGCircleElement, d: PhyllotaxisPoint)
    // {
    //   let e: D3DragEvent<SVGCircleElement, PhyllotaxisPoint, PhyllotaxisPoint> = d3.event;
    //   d3.select(this).attr('cx', d.x = e.x).attr('cy', d.y = e.y);
    // }

    if (this.parentNativeElement !== null)
    {


      d3ParentElement = d3.select(this.parentNativeElement);

      this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');

      this.d3Svg.attr('width', this.width);
      this.d3Svg.attr('height', this.height);

      //this.points = d3.range(2000).map(phyllotaxis(this.width, this.height, this.dieWidth));

      d3G = this.d3G = this.d3Svg.append<SVGGElement>('g');

      // this.d3G.selectAll<SVGCircleElement, any>('circle')
      //   .data(this.points)
      //   .enter().append<SVGCircleElement>('circle')
      //   .attr('cx', function (d) { return d.x; })
      //   .attr('cy', function (d) { return d.y; })
      //   .attr('r', this.dieHeight)
      //   .call(d3.drag<SVGCircleElement, PhyllotaxisPoint>().on('drag', dragged));

      this.d3Svg.call(d3.zoom<SVGSVGElement, any>()
        .scaleExtent([1 / 2, 8])
        .on('zoom', zoomed));

      this.createDies();
      this.drawDies();

      //this.changeLayout();
    }

  }

  private changeLayout()
  {
    // this.d3Svg
    //   .attr('width', this.width)
    //   .attr('height', this.height);
    // this.points = this.d3.range(2000).map(phyllotaxis(this.width, this.height, this.dieWidth));

    // this.d3G.selectAll<SVGCircleElement, PhyllotaxisPoint>('circle')
    //   .data(this.points)
    //   .attr('cx', function (d) { return d.x; })
    //   .attr('cy', function (d) { return d.y; })
    //   .attr('r', this.dieHeight);

      this.d3G
      .selectAll('line')
      .data(this.d3.range(0, this.width, this.dieWidth))
      .enter()
      .append('line')
      .attr('x1', function(d) { return d; })
      .attr('y1', 0)
      .attr('x2', function(d) { return d; })
      .attr('y2', this.height)
      .attr('stroke','green')
      .attr('fill','none');
      // .attrs({
      //   'x1': function(d) { return d; },
      //   'y1': 0,
      //   'x2': function(d) { return d; },
      //   'y2': this.height,
      //   'stroke':'#ddd',
      //   'fill':'none'
      // });

      this.d3G
        .selectAll('x')
        .data(this.d3.range(0, this.height, this.dieHeight))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', function(d) { return d; })
        .attr('x2', this.width)
        .attr('y2', function(d) { return d; })
        .attr('stroke','green')
        .attr('fill','none');
        // .attrs({
        //   'x1': 0,
        //   'y1': function(d) { return d; },
        //   'x2': this.width,
        //   'y2': function(d) { return d; },
        //   'stroke':'#ddd',
        //   'fill':'none'
        // });

  }

  private drawDies()
  {

    var t = this.d3G.transition()
    .duration(750)
    .attr("fill", function (d) {return d.fillColor});

     var data = this.d3G
              .selectAll("undrawedDies")
               .data(this._arrDies);

               data.enter()
               .append("rect")
              .attr("x", function (d, i) {return d.xCoord * d.xWidth - 1;})
               .attr("y", function (d, i) {return d.yCoord * d.yHeight - 1;})
               .attr("width", function (d) {return d.xWidth-1; })
               .attr("height", function (d) {return d.yHeight-1; })
               //.attr("fill", function (d) {return d.fillColor})
               //.on("mouseover",function(d,i){
               //    d3.select(this)
               //        .attr("fill", "yellow");
               //})
              .append("svg:title")
               .text(function (d) { return d.xCoord+ ',' + d.yCoord; });




    //   data.transition().duration(800)
    // .attr("fill", function (d) {return d.fillColor});
               
               
  }

  private createDies()
  {
        this._arrDies = new Array<DieRect>();
        for (var i = 1; i < 100; i++)
        {
           for (var j = 1; j < 100; j++)
           {
               this._arrDies.push(new DieRect(i, j,0,1));
           }
        }

        this._arrDies.forEach(item => item.xWidth = this.dieWidth);
        this._arrDies.forEach(item => item.yHeight = this.dieHeight);
        this._arrDies.forEach(item => item.fillColor = "lightgrey");
  }

}

