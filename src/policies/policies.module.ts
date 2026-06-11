import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Infrastructure
import { PolicyTypeormEntity } from './infrastructure/persistence/policy.typeorm-entity';
import { PolicyTypeormRepository } from './infrastructure/persistence/policy.typeorm-repository';
import { PolicyMapper } from './infrastructure/persistence/policy.mapper';
import { PolicyController } from './infrastructure/controllers/policy.controller';

// Domain ports
import { PolicyRepositoryPort } from './domain/ports/policy-repository.port';
import { PolicyFactoryPort } from './domain/ports/policy-factory.port';
import { RatingStrategyPort } from './domain/ports/rating-strategy.port';
import { PolicyBranch } from './domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from './domain/models/policy-rating-strategy.enum';

// Factories
import { AutoPolicyFactory } from './application/factories/auto.factory';
import { LifePolicyFactory } from './application/factories/life.factory';
import { HomePolicyFactory } from './application/factories/home.factory';
import { HealthPolicyFactory } from './application/factories/health.factory';

// Strategies
import { StandardRatingStrategy } from './application/strategies/standard-rating.strategy';
import { RiskBasedRatingStrategy } from './application/strategies/risk-based-rating.strategy';
import { LoyaltyRatingStrategy } from './application/strategies/loyalty-rating.strategy';

// Use cases
import { CreatePolicyUseCase } from './application/use-cases/create-policy.use-case';
import { FindPolicyUseCase } from './application/use-cases/find-policy.use-case';
import { FindCustomerPoliciesUseCase } from './application/use-cases/find-customer-policies.use-case';
import { ChangePolicyStatusUseCase } from './application/use-cases/change-policy-status.use-case';

// Shared
import { CustomersModule } from '../customers/customers.module';
import { EventsModule } from '../shared/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PolicyTypeormEntity]),
    CustomersModule,
    EventsModule,
  ],
  controllers: [PolicyController],
  providers: [
    PolicyMapper,
    { provide: PolicyRepositoryPort, useClass: PolicyTypeormRepository },

    // Factories concretas
    AutoPolicyFactory,
    LifePolicyFactory,
    HomePolicyFactory,
    HealthPolicyFactory,

    // Map de factories — sin switch en el use case
    {
      provide: 'POLICY_FACTORIES',
      useFactory: (
        auto: AutoPolicyFactory,
        life: LifePolicyFactory,
        home: HomePolicyFactory,
        health: HealthPolicyFactory,
      ): Map<PolicyBranch, PolicyFactoryPort> =>
        new Map([
          [PolicyBranch.AUTO, auto],
          [PolicyBranch.LIFE, life],
          [PolicyBranch.HOME, home],
          [PolicyBranch.HEALTH, health],
        ]),
      inject: [AutoPolicyFactory, LifePolicyFactory, HomePolicyFactory, HealthPolicyFactory],
    },

    // Strategies concretas
    StandardRatingStrategy,
    RiskBasedRatingStrategy,
    LoyaltyRatingStrategy,

    // Map de strategies — sin switch en el use case
    {
      provide: 'RATING_STRATEGIES',
      useFactory: (
        standard: StandardRatingStrategy,
        riskBased: RiskBasedRatingStrategy,
        loyalty: LoyaltyRatingStrategy,
      ): Map<PolicyRatingStrategy, RatingStrategyPort> =>
        new Map([
          [PolicyRatingStrategy.STANDARD, standard],
          [PolicyRatingStrategy.RISK_BASED, riskBased],
          [PolicyRatingStrategy.LOYALTY, loyalty],
        ]),
      inject: [StandardRatingStrategy, RiskBasedRatingStrategy, LoyaltyRatingStrategy],
    },

    // Use cases
    CreatePolicyUseCase,
    FindPolicyUseCase,
    FindCustomerPoliciesUseCase,
    ChangePolicyStatusUseCase,
  ],
})
export class PoliciesModule {}
