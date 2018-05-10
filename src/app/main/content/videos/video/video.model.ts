
import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Video
{
    id: string;
    tube_id: string;
    description: string;
    url: string;
    unique_code: string;

    playback: number;
    createdAt: number;
    active: boolean;

    constructor(product?)
    {
        product = product || {};
        this.id = product.id;
        this.tube_id = product.tube_id;
        this.unique_code = product.unique_code || FuseUtils.generateGUID();
        this.description = product.description || '';
        this.playback = product.quantity || 0;
        this.createdAt = product.createdAt || Date.now();
        this.active = product.active || true;
    }

    addCategory(event: MatChipInputEvent): void
    {
        /*const input = event.input;
        const value = event.value;

        // Add category
        if ( value )
        {
            this.categories.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }*/
    }

    removeCategory(category)
    {
        /*const index = this.categories.indexOf(category);

        if ( index >= 0 )
        {
            this.categories.splice(index, 1);
        }*/
    }

    addTag(event: MatChipInputEvent): void
    {
        /*const input = event.input;
        const value = event.value;

        // Add tag
        if ( value )
        {
            this.tags.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }*/
    }

    removeTag(tag)
    {
        /*const index = this.tags.indexOf(tag);

        if ( index >= 0 )
        {
            this.tags.splice(index, 1);
        }*/
    }
}