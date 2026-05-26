import {
  Controller,
  Post,
 Get,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { StreamsService } from './streams.service';

@Controller('streams')
export class StreamsController {
  constructor(private streamsService: StreamsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('start')
  startStream(@Request() req) {
    return this.streamsService.startStream(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('stop')
  stopStream(@Request() req) {
    return this.streamsService.stopStream(req.user);
  }

  @Get('live')
  getLiveStreams() {
    return this.streamsService.getLiveStreams();
  }
}