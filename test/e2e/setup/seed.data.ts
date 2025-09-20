import { Category } from '@/modules/categories/category.entity';

export const TEST_SEED_USERS = [
  {
    id: 'testuser1',
    name: '테스트사용자1',
    nickname: 'testnickname1',
    password: 'TestPassword1!',
    profileImageUrl: 'https://picsum.photos/40/40?random=101',
  },
  {
    id: 'testuser2',
    name: '테스트사용자2',
    nickname: 'testnickname2',
    password: 'TestPassword2!',
    profileImageUrl: 'https://picsum.photos/40/40?random=102',
  },
  {
    id: 'testuser3',
    name: '테스트사용자3',
    nickname: 'testnickname3',
    password: 'TestPassword3!',
    profileImageUrl: 'https://picsum.photos/40/40?random=103',
  },
];

export const TEST_SEED_CATEGORIES: Partial<Category>[] = [
  { id: 1, name: '테스트영화' },
  { id: 2, name: '테스트드라마' },
  { id: 3, name: '테스트음악' },
];
