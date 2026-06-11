import { Controller, Post, Get, Param, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { FindCustomerUseCase } from '../../application/use-cases/find-customer.use-case';

export class CreateCustomerDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

@ApiTags('customers')
@Controller('api/customers')
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomerUseCase,
    private readonly findCustomer: FindCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateCustomerDto) {
    return this.createCustomer.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find customer by id' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findById(@Param('id') id: string) {
    return this.findCustomer.execute(id);
  }
}
