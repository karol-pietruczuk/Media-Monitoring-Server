import {
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as express from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { BackupService, BackupPayload } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../core/enums/user-role.enum';

interface SafeMulterFile {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
}

class RestoreResponseDto {
  @ApiProperty({ example: true }) success!: boolean;
  @ApiProperty({
    example: 'Konfiguracja systemu została pomyślnie przywrócona.',
  })
  message!: string;
}

@ApiTags('System Backup & Restore')
@ApiBearerAuth()
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
// USUNIĘTO STĄD: @Roles(UserRole.Admin)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('export')
  @Roles(UserRole.Admin) // REKOROMENDOWANE: Przeniesione na poziom metody
  @ApiOperation({
    summary:
      'Eksport kompletnej konfiguracji i ustawień systemu do pliku JSON [ADMIN]',
  })
  @ApiOkResponse({ description: 'Zwraca plik JSON gotowy do pobrania.' })
  async exportBackup(@Res() res: express.Response): Promise<void> {
    const backupData = await this.backupService.createBackupPayload();

    const fileName = `backup-config-${new Date().toISOString().split('T')[0]}.json`;
    const jsonString = JSON.stringify(backupData, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(jsonString);
  }

  @Post('restore')
  @Roles(UserRole.Admin) // REKOMENDOWANE: Przeniesione na poziom metody
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Przywrócenie konfiguracji systemu z pliku JSON (Niszczy obecny stan konfiguracji!) [ADMIN]',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Plik kopii zapasowej konfiguracji .json',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Baza danych została pomyślnie wyczyszczona i zasilona danymi z pliku.',
    type: RestoreResponseDto,
  })
  async restoreBackup(
    @UploadedFile() file: SafeMulterFile | undefined,
  ): Promise<RestoreResponseDto> {
    if (!file) {
      throw new BadRequestException(
        'Wymagane jest przesłanie pliku kopii zapasowej.',
      );
    }

    try {
      const payloadString: string = file.buffer.toString('utf-8');
      const parsedData = JSON.parse(payloadString) as BackupPayload;

      await this.backupService.restoreFromPayload(parsedData);

      return {
        success: true,
        message:
          'Konfiguracja systemu oraz kalibracje zostały pomyślnie przywrócone.',
      };
    } catch (error: unknown) {
      throw new BadRequestException(
        `Błąd podczas przetwarzania pliku kopii zapasowej: ${error instanceof Error ? error.message : 'Niepoprawny format JSON'}`,
      );
    }
  }
}
