import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationInfo {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  address?: string;
}

export class PlaceInfo {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  roadAddress?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  isFromAPI?: boolean;
}

export class CreatePlaceGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationInfo)
  location?: LocationInfo;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceInfo)
  places?: PlaceInfo[];
}
