export class TweetLikeEvent {
  constructor(
    public readonly userId: string,
    public readonly tweetId: number,
  ) {}
}
