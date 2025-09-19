import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Tweet } from './tweet.entity';

@Entity('tweet_likes')
@Unique(['tweet', 'user'])
export class TweetLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tweet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tweetId' })
  tweet: Tweet;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
