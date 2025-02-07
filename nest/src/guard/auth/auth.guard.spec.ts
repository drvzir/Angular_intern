import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest'; // Utility to create mocks

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'amrit' });
    authGuard = new AuthGuard(jwtService);
  });


  it('should allow access when token is valid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid.token.here',
      },
    };

    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest['user']).toEqual({ userId: 1 });
  });

  it('should throw UnauthorizedException when token is missing', async () => {
    const mockRequest = {
      headers: {},
    };

    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('No token provided'),
    );
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid.token.here',
      },
    };

    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should throw UnauthorizedException when token is expired', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer expired.token.here',
      },
    };

    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });

    const tokenExpiredError = new Error('Token has expired');
    tokenExpiredError.name = 'TokenExpiredError';

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(tokenExpiredError);

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Token has expired'),
    );
  });
});