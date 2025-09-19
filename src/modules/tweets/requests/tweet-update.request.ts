import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class TweetUpdateRequest {
  @ApiProperty({
    description: '수정할 트윗 내용',
    example: '김형준 개발 과제 테스트 리팩토링중 ... ',
    maxLength: 280,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '트윗을 작성해주세요.' })
  @MaxLength(280, { message: '트윗의 최대 글자 수는 280자 입니다.' })
  content: string;
}
