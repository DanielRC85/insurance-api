import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { CreatePolicyUseCase } from '../../application/use-cases/create-policy.use-case';
import { FindPolicyUseCase } from '../../application/use-cases/find-policy.use-case';
import { FindCustomerPoliciesUseCase } from '../../application/use-cases/find-customer-policies.use-case';
import { ChangePolicyStatusUseCase } from '../../application/use-cases/change-policy-status.use-case';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyRatingStrategy } from '../../domain/models/policy-rating-strategy.enum';
import { PolicyStatus } from '../../domain/models/policy-status.enum';

export class CreatePolicyDto {
  @IsUUID()
  customerId: string;

  @IsEnum(PolicyBranch)
  branch: PolicyBranch;

  @IsEnum(PolicyRatingStrategy)
  ratingStrategy: PolicyRatingStrategy;

  @IsOptional()
  riskProfile?: {
    riskScore?: number;
    customerSince?: number;
  };
}

export class ChangePolicyStatusDto {
  @IsEnum(PolicyStatus)
  targetStatus: PolicyStatus;
}

@ApiTags('policies')
@Controller('api/policies')
export class PolicyController {
  constructor(
    private readonly createPolicy: CreatePolicyUseCase,
    private readonly findPolicy: FindPolicyUseCase,
    private readonly findCustomerPolicies: FindCustomerPoliciesUseCase,
    private readonly changePolicyStatus: ChangePolicyStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new policy (QUOTED)' })
  @ApiResponse({ status: 201, description: 'Policy created in QUOTED status' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async create(@Body() dto: CreatePolicyDto) {
    return this.createPolicy.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find policy by id' })
  @ApiResponse({ status: 200, description: 'Policy found' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async findById(@Param('id') id: string) {
    return this.findPolicy.execute(id);
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Find all policies by customer' })
  async findByCustomer(@Param('id') id: string) {
    return this.findCustomerPolicies.execute(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change policy status' })
  @ApiResponse({ status: 200, description: 'Status changed' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangePolicyStatusDto,
  ) {
    return this.changePolicyStatus.execute(id, dto.targetStatus);
  }
}
