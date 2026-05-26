import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamsService {
  private liveStreams: any[] = [];

  startStream(user: any) {
    const stream = {
      streamer: user.email,
      startedAt: new Date(),
      isLive: true,
    };

    this.liveStreams.push(stream);

    return {
      message: 'Stream started successfully',
      stream,
    };
  }

  stopStream(user: any) {
    this.liveStreams = this.liveStreams.filter(
      (stream) => stream.streamer !== user.email,
    );

    return {
      message: 'Stream stopped successfully',
    };
  }

  getLiveStreams() {
    return {
      liveStreams: this.liveStreams,
    };
  }
}