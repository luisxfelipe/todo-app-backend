import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

const mockTodoList: Todo[] = [
  new Todo({ task: 'Tarefa 1', isDone: 0 }),
  new Todo({ task: 'Tarefa 2', isDone: 0 }),
  new Todo({ task: 'Tarefa 3', isDone: 0 }),
];

const mockUpdatedTodo = new Todo({ task: 'Tarefa 1', isDone: 1 });

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn().mockResolvedValue(mockTodoList),
            findOneOrFail: jest.fn().mockResolvedValue(mockTodoList[0]),
            create: jest.fn().mockReturnValue(mockTodoList[0]),
            save: jest.fn().mockResolvedValue(mockTodoList[0]),
            merge: jest.fn().mockReturnValue(mockUpdatedTodo),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  describe('FindAll', () => {
    it('should return an array of todos', async () => {
      // Act
      const result = await todoService.findAll();

      // Assert
      expect(result).toEqual(mockTodoList);

      // Verifica se o método find foi chamado uma vez
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array', () => {
      // Arrange
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.findAll()).rejects.toThrow();
    });
  });

  describe('FindOneOrFail', () => {
    it('should return a todo', async () => {
      // Act
      const result = await todoService.findOneOrFail('1');

      // Assert
      expect(result).toEqual(mockTodoList[0]);

      // Verifica se o método findOneOrFail foi chamado uma vez
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should return an error', () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.findOneOrFail('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Create', () => {
    it('should return a todo', async () => {
      // Arrange
      const data: CreateTodoDto = {
        task: 'Tarefa 1',
        isDone: 0,
      };

      // Act
      const result = await todoService.create(data);

      // Assert
      expect(result).toEqual(mockTodoList[0]);

      // Verifica se o método create foi chamado uma vez
      expect(todoRepository.create).toHaveBeenCalledTimes(1);

      // Verifica se o método save foi chamado uma vez
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return an error', () => {
      // Arrange
      // Arrange
      const data: CreateTodoDto = {
        task: 'Nova Tarefa',
        isDone: 0,
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.create(data)).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should return an updated todo', async () => {
      // Arrange
      const data = {
        task: 'Tarefa 1',
        isDone: 1,
      };

      jest.spyOn(todoRepository, 'save').mockResolvedValueOnce(mockUpdatedTodo);

      // Act
      const result = await todoService.update('1', data);

      // Assert
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should throw a not found exception', () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      const data: UpdateTodoDto = {
        task: 'Tarefa 1',
        isDone: 1,
      };

      // Assert
      expect(todoService.update('1', data)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      const data: UpdateTodoDto = {
        task: 'Tarefa 1',
        isDone: 1,
      };

      // Assert
      expect(todoService.update('1', data)).rejects.toThrowError();
    });
  });

  describe('Remove', () => {
    it('should return an empty object', async () => {
      // Act
      const result = await todoService.remove('1');

      // Assert
      expect(result).toBeUndefined();

      // verifica se o método remove foi chamado uma vez
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);

      // Verifica se o método softDelete foi chamado uma vez
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.remove('1')).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoService.remove('1')).rejects.toThrowError();
    });
  });
});
