import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from "../../utils/logger";

const logger = createLogger('todos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Create TODO event: " + JSON.stringify(event))
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event);

    const newTodoItem = await createTodo(userId, createTodoRequest)
    logger.info("New TODO item: " + JSON.stringify(newTodoItem))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newTodoItem
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
