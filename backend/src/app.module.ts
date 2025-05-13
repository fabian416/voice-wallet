import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeridaController } from './verida/verida.controller';
import { VeridaService } from './verida/verida.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, VeridaController],
  providers: [AppService, VeridaService],
})

export class AppModule {}