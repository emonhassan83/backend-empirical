import { ZodError, ZodIssue } from 'zod'
import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    const lastPath = issue.path[issue.path.length - 1]
    return {
      path: typeof lastPath === 'symbol' ? String(lastPath) : (lastPath ?? ''),
      message: issue.message,
    }
  })

  const statusCode = 400
  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  }
}

export default handleZodError
