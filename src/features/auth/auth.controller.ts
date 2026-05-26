import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'; // <-- NOWE IMPORTY
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRole } from '../../core/enums/user-role.enum';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

interface RequestWithUser {
  user: AuthenticatedUser;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logowanie użytkownika' })
  @ApiOkResponse({
    description: 'Pomyślne zalogowanie. Zwraca parę tokenów.',
    type: AuthResponseDto,
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // <-- Włącza kłódeczkę (autoryzację tokenem) w Swagger UI
  @ApiOperation({
    summary: 'Pobierz profil aktualnie zalogowanego użytkownika',
  })
  @ApiOkResponse({
    description:
      'Zwraca dane profilowe zalogowanego użytkownika na podstawie tokenu.',
    type: UserProfileResponseDto, // <-- Wskazanie struktury
  })
  getProfile(@Request() req: RequestWithUser): AuthenticatedUser {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // <-- Włącza kłódeczkę
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Wylogowanie i czyszczenie sesji' })
  @ApiOkResponse({
    description:
      'Pomyślne wylogowanie. Token odświeżania został unieważniony w bazie danych.',
    type: MessageResponseDto, // <-- Wskazanie struktury
  })
  async logout(@Request() req: RequestWithUser) {
    await this.authService.logout(req.user.id);
    return { message: 'Wylogowano pomyślnie i unieważniono tokeny sesji.' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Odświeżenie tokenów sesji' })
  @ApiOkResponse({
    description: 'Tokeny zostały pomyślnie odświeżone.',
    type: AuthResponseDto,
  })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}
