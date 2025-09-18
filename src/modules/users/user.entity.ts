import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  seq: number;

  @ApiProperty({ description: '사용자 ID', example: 'testuser123' })
  @Index()
  @Column({ unique: true })
  id: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @Column()
  name: string;

  @ApiProperty({ description: '닉네임', example: 'nickname' })
  @Index()
  @Column({ unique: true })
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ description: '프로필 이미지 URL', example: 'https://picsum.photos/40/40?random=1', required: false })
  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt: Date;

  @BeforeInsert()
  private async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  isPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
