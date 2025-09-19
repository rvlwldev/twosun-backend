import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @ApiProperty({ description: '카테고리 아이디', example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '카테고리 이름', example: '개발' })
  @Column({ unique: true })
  name: string;
}
