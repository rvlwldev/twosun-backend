import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Tweet } from '@/modules/tweets/entities/tweet.entity';
import { TweetLike } from '@/modules/tweets/entities/tweet-like.entity';

@Entity('comments')
@Index(['tweet', 'createdAt'])
@Index(['parent'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 280 })
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent, { cascade: true })
  children: Comment[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author: User;

  @ManyToOne(() => Tweet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tweetId' })
  tweet: Tweet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
