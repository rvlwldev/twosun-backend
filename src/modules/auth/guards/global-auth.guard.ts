import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('credentials') {}
