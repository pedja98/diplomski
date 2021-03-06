import { Pipe, PipeTransform } from '@angular/core';
import { FetchMaterialsDto } from 'src/app/dto/fetchMaterialsDto';

@Pipe({
  name: 'itemNumber',
})
export class ItemNumberPipe implements PipeTransform {
  transform(materials: FetchMaterialsDto[], itemNumber: string): any {
    if (!materials || !itemNumber) {
      return materials;
    }
    return materials.filter((material) =>
      material.itemNumber.toLowerCase().includes(itemNumber.toLowerCase())
    );
  }
}
