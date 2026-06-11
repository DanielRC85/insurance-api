import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PolicyTypeormEntity } from './infrastructure/persistence/policy.typeorm-entity';
import { PolicyTypeormRepository } from './infrastructure/persistence/policy.typeorm-repository';
import { PolicyMapper } from './infrastructure/persistence/policy.mapper';
import { PolicyController } from './infrastructure/controllers/policy.controller';

import { PolicyRepositoryPort } from './domain/ports/policy-repository.port';
import { PolicyFactoryPort } from './domain/ports/policy-factory.port';
import { RatingStrategyPort } from './domain/ports/rating-strategy.port';
import { PolicyStatePort } from './domain/ports/policy-state.port';
import { PolicyBranch } from './domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from './domain/models/policy-rating-strategy.enum';
import { PolicyStatus } from './domain/models/policy-status.enum';

import { AutoPolicyFactory } from './application/factories/auto.factory';
import { LifePolicyFactory } from './application/factories/life.factory';
import { HomePolicyFactory } from './application/factories/home.factory';
import { HealthPolicyFactory } from './application/factories/health.factory';

import { StandardRatingStrategy } from './application/strategies/standard-rating.strategy';
import { RiskBasedRatingStrategy } from './application/strategies/risk-based-rating.strategy';
import { LoyaltyRatingStrategy } from './application/strategies/loyalty-rating.strategy';

import { QuotedState } from './domain/states/quoted.state';
import { IssuedState } from './domain/states/issued.state';
import { ActiveState } from './domain/states/active.state';
import { SuspendedState } from './domain/states/suspended.state';
import { CancelledState } from './domain/states/cancelled.state';

import { CreatePolicyUseCase } from './application/use-cases/create-policy.use-case';
import { FindPolicyUseCase } from './application/use-cases/find-policy.use-case';
import { FindCustomerPoliciesUseCase } from './application/use-cases/find-customer-policies.use-case';
import { ChangePolicyStatusUseCase } from './application/use-cases/change-policy-status.use-case';

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

    AutoPolicyFactory, LifePolicyFactory, HomePolicyFactory, HealthPolicyFactory,
    {
      provide: 'POLICY_FACTORIES',
      useFactory: (
        auto: AutoPolicyFactory, life: LifePolicyFactory,
        home: HomePolicyFactory, health: HealthPolicyFactory,
      ): Map<PolicyBranch, PolicyFactoryPort> =>
        new Map([
          [PolicyBranch.AUTO, auto],
          [PolicyBranch.LIFE, life],
          [PolicyBranch.HOME, home],
          [PolicyBranch.HEALTH, health],
        ]),
      inject: [AutoPolicyFactory, LifePolicyFactory, HomePolicyFactory, HealthPolicyFactory],
    },

    StandardRatingStrategy, RiskBasedRatingStrategy, LoyaltyRatingStrategy,
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

    QuotedState, IssuedState, ActiveState, SuspendedState, CancelledState,
    {
      provide: 'POLICY_STATES',
      useFactory: (
        quoted: QuotedState, issued: IssuedState,
        active: ActiveState, suspended: SuspendedState,
        cancelled: CancelledState,
      ): Map<PolicyStatus, PolicyStatePort> =>
        new Map([
          [PolicyStatus.QUOTED, quoted],
          [PolicyStatus.ISSUED, issued],
          [PolicyStatus.ACTIVE, active],
          [PolicyStatus.SUSPENDED, suspended],
          [PolicyStatus.CANCELLED, cancelled],
        ]),
      inject: [QuotedState, IssuedState, ActiveState, SuspendedState, CancelledState],
    },

    CreatePolicyUseCase,
    FindPolicyUseCase,
    FindCustomerPoliciesUseCase,
    ChangePolicyStatusUseCase,
  ],
})
export class PoliciesModule {}
