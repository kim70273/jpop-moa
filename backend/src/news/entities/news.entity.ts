import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalTitle: string; // Added

  @Column('text')
  originalContent: string; // Added

  @Column()
  translatedTitle: string; // Renamed from 'title'

  @Column('text', { nullable: true })
  translatedContent: string;

  @Column({ unique: true })
  sourceUrl: string;

  @Column()
  category: string; // e.g., 'Concert', 'Goods', 'New Song', 'Official'

  @Column({ type: 'timestamp', nullable: true }) // Made nullable
  publishedAt: Date | null; // Explicitly set to Date | null

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Artist, (artist) => artist.news, { onDelete: 'CASCADE' })
  artist: Artist;
}
