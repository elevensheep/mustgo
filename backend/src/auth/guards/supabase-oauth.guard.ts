import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseOAuthGuard extends AuthGuard('supabase-oauth') {}
