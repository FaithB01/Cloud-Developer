import {
  createTodoItem,
  deleteTodoItem,
  getTodoItemsPerUser,
  updateAttachmentUrl,
  updateTodoItem
} from '../dataLayer/todosAccess'
import { getAttachmentBucketUrl, createAttachmentPresignedUrl } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('todos')

export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
  return getTodoItemsPerUser(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4();

  const newTodoItem: TodoItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  }

  logger.info('Storing new Todo: ' + newTodoItem)
  return createTodoItem(newTodoItem);
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
  logger.info('Update Todo Item: ', {userId: userId, todoId: todoId, updateTodoRequest: updateTodoRequest})
  return updateTodoItem(userId, todoId, updateTodoRequest);
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
  logger.info('Delete Todo Item: ', {userId: userId, todoId: todoId})
  return deleteTodoItem(userId, todoId)
}

export async function createUploadUrl(attachmentId: string): Promise<string> {
  logger.info('Create new pre-signed upload url for todoId: ' + attachmentId)
  const url = createAttachmentPresignedUrl(attachmentId)
  logger.info("Upload URL: " + url)
  return url;
}

export async function addAttachmentToTodo(userId: string, todoId: string, attachmentId: string): Promise<void> {
  const attachmentUrl = getAttachmentBucketUrl(attachmentId);
  logger.info('Get attachment URL: ' + attachmentUrl)
  await updateAttachmentUrl(userId, todoId, attachmentUrl)
}