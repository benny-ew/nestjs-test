import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'nest-keycloak-connect';

@Controller()
@Public() // Make app controller endpoints public
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
