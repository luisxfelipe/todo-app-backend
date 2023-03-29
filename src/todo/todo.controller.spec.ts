import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const mockTodoList: Todo[] = [
  new Todo({ id: '1', task: 'Tarefa 1', isDone: 0 }),
  new Todo({ id: '2', task: 'Tarefa 2', isDone: 0 }),
  new Todo({ id: '3', task: 'Tarefa 3', isDone: 0 }),
];

const mockTodo = new Todo({ task: 'Nova Tarefa', isDone: 0 });

const mockUpdatedTodo = new Todo({ task: 'Tarefa 1', isDone: 1 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTodo),
            findAll: jest.fn().mockResolvedValue(mockTodoList),
            findOneOrFail: jest.fn().mockResolvedValue(mockTodoList[0]),
            update: jest.fn().mockResolvedValue(mockUpdatedTodo),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('Create', () => {
    it('should return a todo', async () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'Nova Tarefa',
        isDone: 0,
      };

      // Act
      const result = await todoController.create(body);

      // Assert
      expect(result).toEqual(mockTodo);

      //  Verifica se o método create foi chamado uma vez
      expect(todoService.create).toHaveBeenCalledTimes(1);

      //  Verifica se o método create foi chamado com os parâmetros corretos
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'Nova Tarefa',
        isDone: 1,
      };

      // Mocka o método create para retornar um erro e reseta o mock após o teste
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('FindAll', () => {
    it('should return an array of todos', async () => {
      // Act
      const result = await todoController.findAll();

      // Assert
      expect(result).toEqual(mockTodoList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      // Mocka o método findAll para retornar um erro e reseta o mock após o teste
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.findAll()).rejects.toThrowError();
    });
  });

  describe('FindOne', () => {
    it('should return a todo', async () => {
      // Act
      const result = await todoController.findOne('1');

      // Assert
      expect(result).toEqual(mockTodoList[0]);

      //  Verifica se o método findOneOrFail foi chamado uma vez
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);

      //  Verifica se o método findOneOrFail foi chamado com os parâmetros corretos
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', () => {
      // Arrange
      // Mocka o método findOneOrFail para retornar um erro e reseta o mock após o teste
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.findOne('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return an updated todo', async () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'Tarefa 1',
        isDone: 1,
      };

      // Act
      const result = await todoController.update('1', body);

      // Assert
      expect(result).toEqual(mockUpdatedTodo);

      //  Verifica se o método update foi chamado uma vez
      expect(todoService.update).toHaveBeenCalledTimes(1);

      //  Verifica se o método update foi chamado com os parâmetros corretos
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      // Mocka o método update para retornar um erro e reseta o mock após o teste
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      // Act
      const result = await todoController.remove('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      // Mocka o método remove para retornar um erro e reseta o mock após o teste
      jest.spyOn(todoService, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(todoController.remove('1')).rejects.toThrowError();
    });
  });
});
