import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { PolicyStatus } from '../../domain/models/policy-status.enum';

// Entidad TypeORM — separada del modelo de dominio
@Entity('policies')
export class PolicyTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  policyNumber: string;

  @Column('uuid')
  customerId: string;

  @Column({ type: 'enum', enum: PolicyBranch })
  branch: PolicyBranch;

  @Column({ type: 'enum', enum: PolicyRatingStrategy })
  ratingStrategy: PolicyRatingStrategy;

  @Column({ type: 'enum', enum: PolicyStatus, default: PolicyStatus.QUOTED })
  status: PolicyStatus;

  @Column({ type: 'jsonb' })
  coverage: Record<string, any>;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthlyPremium: number;

  @Column({ type: 'jsonb', default: '{}' })
  riskProfile: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
