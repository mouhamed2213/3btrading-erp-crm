import { describe, expect, it, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

const { storagePutMock } = vi.hoisted(() => ({ storagePutMock: vi.fn() }));
vi.mock('./storage', () => ({
  storagePut: storagePutMock,
}));

const createContext = (): TrpcContext => ({
  user: {
    id: 1,
    openId: 'test-admin',
    name: 'Test Admin',
    email: 'admin@test.local',
    loginMethod: 'test',
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as TrpcContext['req'],
  res: {} as TrpcContext['res'],
});

describe('catalogue.uploadImage', () => {
  it('refuse l’accès à un compte non authentifié', async () => {
    const caller = appRouter.createCaller({
      ...createContext(),
      user: null,
    });

    await expect(
      caller.catalogue.uploadImage({
        fileName: 'photo.png',
        contentType: 'image/png',
        dataBase64: Buffer.from('image-bytes').toString('base64'),
      }),
    ).rejects.toThrow('required permission');

    expect(storagePutMock).not.toHaveBeenCalled();
  });

  it('refuse les formats qui ne sont pas des images acceptées', async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.catalogue.uploadImage({
        fileName: 'plan.pdf',
        contentType: 'application/pdf',
        dataBase64: Buffer.from('fake').toString('base64'),
      }),
    ).rejects.toThrow('Format accepté');

    expect(storagePutMock).not.toHaveBeenCalled();
  });

  it('convertit et transmet une image valide au stockage persistant', async () => {
    storagePutMock.mockResolvedValueOnce({ key: '3btrading/catalogue/photo.png', url: '/manus-storage/photo.png' });
    const caller = appRouter.createCaller(createContext());

    const result = await caller.catalogue.uploadImage({
      fileName: 'Pelle 320.png',
      contentType: 'image/png',
      dataBase64: Buffer.from('image-bytes').toString('base64'),
    });

    expect(result.url).toBe('/manus-storage/photo.png');
    expect(storagePutMock).toHaveBeenCalledWith(
      expect.stringContaining('3btrading/catalogue/'),
      expect.any(Buffer),
      'image/png',
    );
  });
});
