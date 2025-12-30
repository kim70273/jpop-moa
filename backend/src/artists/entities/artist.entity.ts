import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { NewsSource } from '../../news-source/entities/news-source.entity';

// entity 에는 서비스로 받고, 리턴할 데이터의 구조를 정의
@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true }) // Add koreanName column
  koreanName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => News, (news) => news.artist)
  news: News[];

  @OneToMany(() => NewsSource, (newsSource) => newsSource.artist)
  newsSources: NewsSource[];
}
