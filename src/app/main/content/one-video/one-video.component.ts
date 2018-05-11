import { OnInit, Component, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { OneVideoService } from './one-video.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FuseUtils } from '@fuse/utils';

@Component({
  selector: 'app-one-video',
  templateUrl: './one-video.component.html',
  styleUrls: ['./one-video.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class OneVideoComponent implements OnInit {

    widgets: any;
    widget1SelectedYear = '2018';
    widget5SelectedDay = 'today';

    form: FormGroup;
    formErrors: any;

    curVideo: any;

    curTubeID:string;
    curTitle: string;
    curUNIQUE: string;

  constructor(private oneVideoService: OneVideoService, private formBuilder: FormBuilder) {
    // Get the widgets from the service
    this.widgets = this.oneVideoService.widgets;

    // Register the custom chart.js plugin
    this.registerCustomChartJSPlugin();

    // Reactive form errors
    this.formErrors = {
        tube_id   : {},
        description : {},
        unique_code : {},
    };

   }

  ngOnInit() {

    this.form = this.formBuilder.group({
        tube_id : ['', Validators.required],
        description  : ['', Validators.required],
        unique_code  : ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
        console.log('form value changed')
    });

    this.oneVideoService.getVideoList().then(data => {
      this.curVideo = data[0];
      this.curTitle = this.curVideo.title;
      this.curTubeID = this.curVideo.tube_id;
      this.curUNIQUE = this.curVideo.unique_code;
    });
    
  }

  onUpdateVideo(){
    this.curVideo.title = this.curTitle;
    this.curVideo.tube_id = this.curTubeID;
    this.curVideo.unique_code = this.curUNIQUE;
    this.oneVideoService.updateVideo(this.curVideo);
  }

  onUpdateCode(){
    this.curUNIQUE = FuseUtils.generateGUID();
  }

  /**
     * Register a custom plugin
     */
    registerCustomChartJSPlugin()
    {
        (<any>window).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing) {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i) {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function (element, index) {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

}
