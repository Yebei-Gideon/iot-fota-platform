import { AuthService } from '@fota-api/auth/auth.service'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get()
  getHello(): string {
    return this.authService.getHello()
  }
}
