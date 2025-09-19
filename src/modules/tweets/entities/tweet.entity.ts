import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { Category } from '@/modules/categories/category.entity';
import { TweetImage } from './tweet-image.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { Retweet } from '@/modules/tweets/entities/retweet.entity';
import { TweetLike } from '@/modules/tweets/entities/tweet-like.entity';

@Entity('tweets')
@Index(['categoryId', 'createdAt'])
@Index(['author', 'createdAt'])
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author: User;

  @Column({ type: 'varchar', length: 280 })
  content: string;

  @OneToMany(() => TweetImage, (tweetImage) => tweetImage.tweet, { cascade: true })
  images: TweetImage[];

  @OneToMany(() => Comment, (comment) => comment.tweet, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Retweet, (retweet) => retweet.tweet, { cascade: true })
  retweets: Retweet[];

  @OneToMany(() => TweetLike, (like) => like.tweet, { cascade: true })
  likes: TweetLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  addAllImageUrls(imageUrls: string[]) {
    if (!this.images) this.images = [];

    if (!imageUrls || imageUrls.length === 0) return;

    const images = imageUrls.map((url) => {
      const image = new TweetImage();

      image.url = url;
      image.tweet = this;

      return image;
    });

    this.images.push(...images);
  }

  addRetweetByUser(user: User) {
    if (!this.retweets) this.retweets = [];

    if (this.author.id === user.id) {
      throw new Error('자신의 트윗은 리트윗할 수 없습니다.');
    }

    if (this.retweets.some((retweet) => retweet.user.id === user.id)) {
      throw new Error('이미 리트윗한 트윗입니다.');
    }

    const retweet = new Retweet();

    retweet.user = user;
    retweet.tweet = this;

    this.retweets.push(retweet);
  }

  // 좋아요 기능은 에러를 던지지 않음.
  addLikeByUser(user: User): boolean {
    if (!this.likes) this.likes = [];

    if (this.likes.some((like) => like.user.id === user.id)) {
      return false;
    }

    const like = new TweetLike();
    like.user = user;
    like.tweet = this;

    this.likes.push(like);

    return true;
  }
}
