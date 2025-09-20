import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TweetService } from '@/modules/tweets/tweet.service';
import { UserService } from '@/modules/users/user.service';

import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    private readonly datasource: DataSource,
    private readonly tweetService: TweetService,
    private readonly userService: UserService,
  ) {}

  private NOT_FOUND_COMMENT_MESSAGE = '존재하지 않는 댓글입니다.';

  async createComment(userId: string, tweetId: number, content: string, parentId?: number): Promise<Comment> {
    return this.datasource.transaction(async (manager) => {
      const author = await this.userService.findUserById(userId);
      const tweet = await this.tweetService.findTweetById(tweetId);
      let parent: Comment | null = null;

      if (parentId) {
        parent = await manager.findOneBy(Comment, { id: parentId });
        if (!parent) throw new NotFoundException(this.NOT_FOUND_COMMENT_MESSAGE);
      }

      const comment = manager.create(Comment, { content, author, tweet, parent });
      return manager.save(comment);
    });
  }

  async findCommentsByTweet(tweetId: number): Promise<Comment[]> {
    const comments = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.parent', 'parent')
      .where('comment.tweetId = :tweetId', { tweetId })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    const tree: (Comment & { children: Comment[] })[] = [];
    const map = new Map<number, Comment & { children: Comment[] }>();

    for (const comment of comments) {
      map.set(comment.id, { ...comment, children: [] });
    }

    for (const comment of comments) {
      const node = map.get(comment.id)!;

      if (comment.parent && map.has(comment.parent.id)) {
        map.get(comment.parent.id)!.children.push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  }

  async updateComment(userId: string, commentId: number, content: string): Promise<Comment> {
    const comment = await this.repo.findOneOrFail({ where: { id: commentId }, relations: ['author'] });

    if (comment.author.id !== userId) {
      throw new ForbiddenException('자신이 작성한 댓글만 수정할 수 있습니다.');
    }

    comment.content = content;
    return this.repo.save(comment);
  }

  async deleteComment(userId: string, commentId: number): Promise<void> {
    const comment = await this.repo.findOneOrFail({ where: { id: commentId }, relations: ['author'] });

    if (comment.author.id !== userId) {
      throw new ForbiddenException('자신이 작성한 댓글만 삭제할 수 있습니다.');
    }

    const result = await this.repo.softDelete(commentId);
    if (result.affected === 0) {
      throw new NotFoundException(this.NOT_FOUND_COMMENT_MESSAGE);
    }
  }
}
