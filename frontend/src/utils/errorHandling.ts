export type Result<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: E; data?: never };

export class GameError extends Error {
  constructor(
    message: string, 
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export const createResult = <T>(data: T): Result<T> => ({ 
  success: true, 
  data 
});

export const createError = <E extends Error>(error: E): Result<never, E> => ({ 
  success: false, 
  error 
});

export const safeExecute = <T>(
  operation: () => T, 
  errorContext?: string
): Result<T> => {
  try {
    const result = operation();
    return createResult(result);
  } catch (error) {
    const gameError = error instanceof GameError 
      ? error 
      : new GameError(
          error instanceof Error ? error.message : 'Unknown error', 
          'EXECUTION_ERROR',
          { originalError: error, context: errorContext }
        );
    
    return createError(gameError);
  }
};

// Utility for handling async operations
export const safeExecuteAsync = async <T>(
  operation: () => Promise<T>,
  errorContext?: string  
): Promise<Result<T>> => {
  try {
    const result = await operation();
    return createResult(result);
  } catch (error) {
    const gameError = error instanceof GameError 
      ? error 
      : new GameError(
          error instanceof Error ? error.message : 'Unknown async error',
          'ASYNC_ERROR',
          { originalError: error, context: errorContext }
        );
    
    return createError(gameError);
  }
};

// Error reporting for UI
export interface ErrorReport {
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  userFriendlyMessage: string;
  actionable: boolean;
  recoveryOptions?: string[];
}

export const createErrorReport = (error: GameError): ErrorReport => {
  const severity = getSeverityFromCode(error.code);
  
  return {
    message: error.message,
    severity,
    timestamp: Date.now(),
    userFriendlyMessage: getUserFriendlyMessage(error),
    actionable: isActionable(error.code),
    recoveryOptions: getRecoveryOptions(error.code)
  };
};

const getSeverityFromCode = (code: string): ErrorReport['severity'] => {
  if (code.includes('CRITICAL') || code.includes('CORRUPTION')) return 'critical';
  if (code.includes('VALIDATION') || code.includes('NOT_FOUND')) return 'medium';
  if (code.includes('INSUFFICIENT')) return 'low';
  return 'low';
};

const getUserFriendlyMessage = (error: GameError): string => {
  switch (error.code) {
    case 'EMPIRE_NOT_FOUND':
      return 'The selected empire could not be found. Please refresh the game.';
    case 'PLANET_NOT_FOUND':
      return 'The selected planet could not be found.';
    case 'INSUFFICIENT_RESOURCES':
      return 'You do not have enough resources to complete this action.';
    case 'PLANET_ALREADY_COLONIZED':
      return 'This planet has already been colonized by another empire.';
    case 'PLANET_NOT_SURVEYED':
      return 'You must survey this planet before you can colonize it.';
    default:
      return error.message;
  }
};

const isActionable = (code: string): boolean => {
  return ['INSUFFICIENT_RESOURCES', 'PLANET_NOT_SURVEYED'].includes(code);
};

const getRecoveryOptions = (code: string): string[] | undefined => {
  switch (code) {
    case 'INSUFFICIENT_RESOURCES':
      return ['Wait for resource income', 'Trade with other empires', 'Focus on resource production'];
    case 'PLANET_NOT_SURVEYED':
      return ['Send a survey mission', 'Build more exploration ships'];
    default:
      return undefined;
  }
};