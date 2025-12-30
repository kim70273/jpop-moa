import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async findOrCreate(name: string, koreanName?: string): Promise<Artist> {
    let artist = await this.artistsRepository.findOne({ where: { name } });
    const finalKoreanName =
      koreanName && koreanName !== 'Not Found' ? koreanName : name; // Use name as fallback

    if (!artist) {
      artist = this.artistsRepository.create({
        name,
        koreanName: finalKoreanName,
      });
      await this.artistsRepository.save(artist);
    } else if (finalKoreanName && !artist.koreanName) {
      // If artist exists but koreanName is not set, update it
      artist.koreanName = finalKoreanName;
      await this.artistsRepository.save(artist);
    }
    return artist;
  }

  async findAll(search?: string, limit?: number): Promise<Artist[]> {
    const findOptions: FindManyOptions<Artist> = {};
    if (search) {
      findOptions.where = [
        { name: ILike(`%${search}%`) },
        { koreanName: ILike(`%${search}%`) },
      ];
    }
    if (limit) {
      findOptions.take = limit;
    }
    return this.artistsRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Artist | null> {
    return this.artistsRepository.findOne({ where: { id } });
  }

  create(createArtistDto: CreateArtistDto) {
    return 'This action adds a new artist';
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
