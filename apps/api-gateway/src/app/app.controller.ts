import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

const { API_PREFIX } = process.env
const apiPrefix = API_PREFIX as string
const redirectTarget = `/${apiPrefix}/docs`

@ApiTags('Root')
@Controller('/')
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Redirect to API documentation of the api version',
    description: 'Redirects the root URL path to the configured API prefix endpoint.',
  })
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
    description: 'Successfully redirected to the API prefix.',
    headers: {
      Location: {
        description: 'The target API path configuration.',
        schema: {
          type: 'string',
        },
      },
    },
  })
  // 👇 Added documentation for the resolved redirect target payload
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The final Swagger HTML document returned after the browser follows the redirection.',
  })
  home(@Res() response: Response) {
    return response.redirect(HttpStatus.MOVED_PERMANENTLY, redirectTarget)
  }
}
