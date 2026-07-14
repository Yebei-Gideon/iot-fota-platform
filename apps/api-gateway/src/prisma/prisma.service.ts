import { FotaPrismaClient } from '@fota/database'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaService extends FotaPrismaClient {}
