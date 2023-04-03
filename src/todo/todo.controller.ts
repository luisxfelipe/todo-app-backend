import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindAllTodoSwagger } from './swagger/findAll-todo.swagger';
import { CreateTodoSwagger } from './swagger/create-todo.swagger copy 2';
import { FindOneTodoSwagger } from './swagger/findOne-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger copy 3';
import { BadRequestSwagger } from '../helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from '../helpers/swagger/not-found.swagger';

@Controller('api/v1/todo')
@ApiTags('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros inválidos',
    type: BadRequestSwagger,
  })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de tarefas retornada com sucesso',
    type: FindAllTodoSwagger,
    isArray: true,
  })
  async findAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar uma tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa retornada com sucesso',
    type: FindOneTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    type: NotFoundSwagger,
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Parametros inválidos',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Tarefa deletada com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    type: NotFoundSwagger,
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.remove(id);
  }
}
