import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [ConfigModule.forRoot(), PublicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
