import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Tweet } from '@/modules/tweets/entities/tweet.entity';

@Entity('retweets')
@Index(['tweet', 'createdAt'])
export class Retweet {
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
