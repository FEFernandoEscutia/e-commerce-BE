import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class MinSizeValidator implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const minSize = 1000

        if(value.size < minSize ){
            throw new BadRequestException("The file size is too small. Please upload a file that meets the minimum size requirement.")
        }

        return value
    }
}