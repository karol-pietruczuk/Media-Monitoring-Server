import { PartialType } from '@nestjs/mapped-types';
import { CreateDataSourceDto } from './create-data-source.dto';

// Oczyszczono z obejścia (hacku) "SafePartialType". Standardowe użycie PartialType z NestJS
// w pełni poprawnie mapuje opcjonalne pola i jest bezpieczne typologicznie.
export class UpdateDataSourceDto extends PartialType(CreateDataSourceDto) {}
