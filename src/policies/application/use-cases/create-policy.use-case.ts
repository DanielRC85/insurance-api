import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { CustomerRepositoryPort } from '../../../customers/domain/ports/customer-repository.port';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { PolicyBuilder } from '../builders/policy.builder';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { PolicyNumberSequencer } from '../../../shared/events/infrastructure/policy-number-sequencer';
import { CustomerNotFoundException } from '../../../customers/domain/exceptions/customer-not-found.exception';
import { UnsupportedBranchException } from '../../domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../domain/exceptions/unsupported-rating-strategy.exception';
import { RiskProfileVO } from '../../domain/models/policy.model';
import { PolicyStatus } from '../../domain/models/policy-status.enum';

export interface CreatePolicyDto {
  customerId: string;
  branch: PolicyBranch;
  ratingStrategy: PolicyRatingStrategy;
  riskProfile?: RiskProfileVO;
}

@Injectable()
export class CreatePolicyUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly sequencer: PolicyNumberSequencer,
    // Map de factories — sin switch, OCP garantizado
    @Inject('POLICY_FACTORIES')
    private readonly factories: Map<PolicyBranch, PolicyFactoryPort>,
    // Map de strategies — sin switch, OCP garantizado
    @Inject('RATING_STRATEGIES')
    private readonly strategies: Map<PolicyRatingStrategy, RatingStrategyPort>,
  ) {}

  async execute(dto: CreatePolicyDto) {
    // 1. Verificar cliente existe y está activo
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      throw new CustomerNotFoundException(dto.customerId);
    }

    // 2. Seleccionar factory por ramo — sin switch
    const factory = this.factories.get(dto.branch);
    if (!factory) throw new UnsupportedBranchException(dto.branch);

    // 3. Seleccionar strategy de tarificación — sin switch
    const strategy = this.strategies.get(dto.ratingStrategy);
    if (!strategy) throw new UnsupportedRatingStrategyException(dto.ratingStrategy);

    // 4. Validar reglas específicas de la strategy
    const riskProfile = dto.riskProfile ?? {};
    strategy.validate(riskProfile);

    // 5. Calcular prima con la strategy
    const basePremium = factory.getBasePremium();
    const monthlyPremium = strategy.calculatePremium(basePremium, riskProfile);

    // 6. Obtener cobertura por defecto del ramo via factory
    const coverage = factory.createDefaultCoverage();

    // 7. Generar número de póliza via Singleton
    const policyNumber = this.sequencer.generate();

    // 8. Construir agregado via Builder — siempre inicia en QUOTED
    const policy = new PolicyBuilder()
      .forCustomer(dto.customerId)
      .withBranch(dto.branch)
      .withRatingStrategy(dto.ratingStrategy)
      .withCoverage(coverage)
      .withMonthlyPremium(monthlyPremium)
      .withRiskProfile(riskProfile)
      .withPolicyNumber(policyNumber)
      .build();

    // 9. Persistir
    const saved = await this.policyRepository.save(policy);

    return saved;
  }
}
