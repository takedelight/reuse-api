import { type UserRole } from 'src/core/user/domain/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', nullable: true, unique: true, default: null })
  githubId: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true, default: null })
  googleId: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatarUrl: string | null;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  password: string | null;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
