import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  app.use(helmet());

  // Comma-separated for deployments where the storefront is reachable on
  // more than one origin (e.g. apex + www + a fallback domain).
  const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  });

  // whitelist + forbidNonWhitelisted: any field a tampered client sends
  // beyond what the DTO declares (e.g. a manipulated `price`) is rejected
  // outright rather than silently stripped, so tampering fails loudly.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  Logger.log(`Backend listening on port ${port}`, "Bootstrap");
}

bootstrap();
