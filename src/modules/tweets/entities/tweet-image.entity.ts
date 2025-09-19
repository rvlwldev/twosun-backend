import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

import { Tweet } from './tweet.entity';

@Entity('tweet_images')
@Index(['tweet'])
export class TweetImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tweet, (tweet) => tweet.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tweetId' })
  tweet: Tweet;

  @Column({ type: 'varchar', length: 255 })
  url: string;
}
