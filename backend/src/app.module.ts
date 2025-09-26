import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { CommentsModule } from './comments/comments.module';
import { PlaceGroupsModule } from './place-groups/place-groups.module';
import { AuthModule } from './auth/auth.module';
import { CacheConfigModule } from './common/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 임시로 비활성화
      logging: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        // Supabase Transaction Pooler 설정
        max: 5, // 최대 연결 수
        min: 1, // 최소 연결 수
        acquire: 30000, // 연결 획득 타임아웃 (30초)
        idle: 10000, // 유휴 연결 타임아웃 (10초)
        // Transaction Pooler를 위한 추가 설정
        statement_timeout: 0,
        query_timeout: 0,
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 0,
      },
    }),
    CacheConfigModule,
    UsersModule,
    PlacesModule,
    CommentsModule,
    PlaceGroupsModule,
    AuthModule,
  ],
})
export class AppModule {}