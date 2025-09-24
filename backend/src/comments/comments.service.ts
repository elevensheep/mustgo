import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Place } from '../places/entities/place.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPlaceId(placeId: string): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.place', 'place')
      .where('place.placeId = :placeId', { placeId })
      .getMany();
  }

  async create(placeId: string, userId: string, content: string): Promise<Comment> {
    // Place와 User 존재 확인
    const place = await this.placesRepository.findOne({ where: { placeId } });
    const user = await this.usersRepository.findOne({ where: { uuid: userId } });

    if (!place || !user) {
      throw new Error('Place or User not found');
    }

    const comment = this.commentsRepository.create({
      content,
      place,
      user,
    });

    return this.commentsRepository.save(comment);
  }
}