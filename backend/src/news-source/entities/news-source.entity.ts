import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';

@Entity('news_sources')
export class NewsSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @ManyToOne(() => Artist, (artist) => artist.newsSources, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  artist: Artist;

  @Column({ type: 'timestamp', nullable: true })
  lastCrawledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
